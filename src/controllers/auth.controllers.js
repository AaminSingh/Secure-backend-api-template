import {User} from '../models/user.models.js';
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { ref } from 'process';
import{emailVerificationMailgenContent, ForgotPasswordMailgenContent, sendEmail} from "../utils/mail.js"
import { create } from 'domain';
import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong before generating new acess token"
        )
    }
}

const registerUser = asyncHandler(async(req, res) =>{
        const {email,username,password, role} = req.body


        const existerUser = await User.findOne({
            $or: [{username},{email}]                   // this checks whether the user is there or not in the database
        })

        if(existerUser){
            throw new ApiError(409,"User with email or username already exists")
        }

        const user = await User.create({
            email,
            username,
            password,
            isEmailVerified:false
        })

        const {unHashedToken, hashedToken, tokenExpiry}=  user.generateTemporaryToken();
        user.emailVerificationToken = hashedToken
        user.emailVerificationExpiry = tokenExpiry

        await user.save({validateBeforeSave:false})

        await sendEmail({
            email:user?.email,
            subject:"Please Verify your email",
            mailGenerator:emailVerificationMailgenContent(
              user.username,
              `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`        
            )

        });
        return res
          .status(200)
          .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to your email id"
            )
          )

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        );

        if(!createdUser){
            throw new ApiError(500, "Something went wrong while registering the user ")

        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user:createdUser},
                "User registered sucessfully and verification email has been sent on your email"
            )
        )
});
const login = asyncHandler(async(req, res) =>{
 const {email,password,username}= req.body

 if(!email){
    throw new ApiError(400,"Username or email required!!")
}

 const user = await User.findOne({email})
 if(!user){
    throw new ApiError(400,"User does not exists!!")
 }

  const ispasswordValid= await user.isPasswordCorrect(password);
  if(!ispasswordValid){
    throw new ApiError(400, "Invalid credentials!!")
  }

   const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id)
   const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        );
        const options = {
          httpOnly:true,
          secure:true
        }

        return res
          .status(200)
          .cookie("accessToken",accessToken,options)
          .cookie("refreshToken", refreshToken,options)
          .json(    
            new ApiResponse(
              200,
              {
                user:loggedInUser,
                accessToken,
                refreshToken
              },
              "User loggedin Sucessfully"
            )
          )
}); 

const logoutUser = asyncHandler(async(req, res)=>{
 await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:"",
        },
    },
    {
    new:true
},
 ) 
 const options ={
    httpOnly:true,
    secure:true
 };
 return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(
    new ApiResponse(200, {}, "user logged out")
   )

});

const getCurrentUser = asyncHandler(async(req, res) =>{
   return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
     )
})
const verifyEmail = asyncHandler(async(req, res) =>{
     const {verificationToken}= req.params        //this verification token is coming from the url which we have sent to the user email for verification
     if(!verificationToken){
        throw new ApiError(400,"Email verification token is missing");
     }

     let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

     const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry:{$gt:Date.now()}
     })   

     if(!user){
        throw new ApiError(400, "Token is invalid or has expired");

     }
     user.emailVerificationToken = undefined;
     user.emailVerificationExpiry = undefined;

     user.isEmailVerified = true;
     await user.save({validateBeforeSave:false})

     return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {
            isEmailVerified : true
            }
        )
      )
})
const resendEmailVerification = asyncHandler(async(req, res) =>{
     const user = await User.findById(req.user._id);

     if(!user){
        throw new ApiError(404,"User does not exist")
     }

     if(user.isEmailVerified){
        throw new ApiError(409,"Email is already verified")
     }
})
const refreshAccessToken = asyncHandler(async(req, res) =>{

   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken;

   if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized access")
   }

   try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);
    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }

    if(incomingRefreshToken !== refreshAccessToken){
        throw new ApiError(401,"Refresh token is expired!!")
    }

    const options = {
        httpOnly:true,
        secure:true
    }
     const {accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

     user.refreshToken = newRefreshToken;
     await user.save()


     return res
       .status(200)
       .cookie("accessToken", accessToken,options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "access token refreshed"
        )

       )
   } catch (error) {
    throw new ApiError(401,"Invalide Refresh token")
   }
})

const forgotPasswordRequest = asyncHandler(async (req,res)=> {
   const {email} = req.body;
   
   const user = await User.findOne({email})

   if(!user){
    throw new ApiError(404,"User does not exist!!",[])

   }

    const {unHashedToken, hashedToken, tokenExpiry}= user.generateTemporaryToken()

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    await user.save({validateBeforeSave:false})

    await sendEmail({
            email:user?.email,
            subject:"Password reset request",
            mailGenerator:ForgotPasswordMailgenContent(
              user.username,
              `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`        
            )

        });

        return res
          .status(200)
          .json(
            new ApiResponse(
                200,
                {},
                "Password reset mail has been sent to your mail id"
            )
          )
})

const resetForgotPassword = asyncHandler(async(req, res) =>{
    const {resetToken} = req.params
    const {newPassword} = req.body

    let hashedToken = crypto
      .createdHash("sha256")
      .update(resetToken)
      .digest("hex")

      const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry:{$gt:Date.now()}
      })

      if(!user){
        throw new ApiError(489,"Token is invalid or expired")
      }
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry = undefined

      user.password = newPassword
      await user.save({validateBeforeSave:false})

      return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {},
            "Password reset successfully"
        )
      )
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    const{oldPassword, newPassword} = req.body

      const user = await User.findById(req.user?._id)

       const isPasswordValid = await user.isPasswordCorrect(oldPassword)

       if(!isPasswordValid){
        throw new ApiError(400,"Invlaid Old password")
       }
       user.password = newPassword
       await user.save({validateBeforeSave:false})

       return res
       .status(200)
       .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
       )
})
export { registerUser, login, logoutUser, getCurrentUser, verifyEmail, refreshAccessToken, forgotPasswordRequest,resendEmailVerification, changeCurrentPassword, resetForgotPassword };