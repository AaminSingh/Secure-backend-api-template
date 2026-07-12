import mongoose, { Schema } from "mongoose";
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"

const projectMemberSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailableUserRoles,        //enum is used to restrict the values of role to only those defined in AvailableUserRoles
        default:UserRolesEnum.MEMBER       //it means if the role is not provided, it will be set to MEMBER by default
    }
},{timestamps:true})

export const ProjectMember = mongoose.model("ProjectMember",projectMemberSchema)