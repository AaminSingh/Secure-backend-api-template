import { User } from "../models/user.models.js";
import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")      // here we are using optional chaining to check if the accessToken is present in the cookies or in the header and we are replacing the "Bearer " from the token if it is present in the header

      if(!token){
        throw new ApiError(401,"unauthorized token")
      }

      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
        if(!user){
            throw new ApiError(401, "User token not valid!")
        }
        req.user = user;  //We store the user in the request so the next functions can use it
        next()
      } catch (error) {
        throw new ApiError(401,"Invalide access token!");
      }
})