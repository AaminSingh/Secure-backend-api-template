import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
  avatar:{
    type:{
       url:String,
       localPath:String
    },
    default:{
        url:`https://placehold.co/200x200`,
        localPath:""
    }
  },
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  fullName:{
    type:String,
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required"]
  },
  isEmailVerified:{
    type:Boolean,
    default:false 
  },
  refreshToken:{
    type:String
  },
  forgotPasswordToken:{
    type:String
  },
  forgotPasswordExpiry:{
    type:Date
  },
  emailVerificationToken:{
    type:String
  },
  emailVerificationExpiry:{
    type:Date
  }
},{
timestamps:true
},

);

userSchema.pre('save',async function(){
    if(!this.isModified("password")) return null        // this is  helping us from the case when we are not changing the password
     this.password = await bcrypt.hash(this.password,10)       //bcrypt hashing the password with 10 rounds of salt
})


userSchema.methods.isPasswordCorrect =  async function(password){
  return await bcrypt.compare(password, this.password)          // this return true or false value based on the comparison is sucessful or not
  
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  )
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,                           // PAYLOAD                    
      username:this.username
    },
    process.env.REFRESH_TOKEN_SECRET,                      //SECRET
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateTemporaryToken = function(){
  const unHashedToken = crypto.randomBytes(20).toString("hex")
  const hashedToken = crypto
  .createHash("sha256")
  .update(unHashedToken)
  .digest("hex")
  const tokenExpiry = Date.now() + (20*60*1000)  // 20 mins
  return {unHashedToken, hashedToken, tokenExpiry}
}
 export const User = mongoose.model("User",userSchema)