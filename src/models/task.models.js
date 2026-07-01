import mongoose from "mongoose";
import {AvailableTaskStatus, AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"
import { Project } from "./project.models.js";
const taskSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:String,
    Project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    assignedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:AvailableTaskStatus.TODO
    },
    attatchments:{                 
        type:[{                     //may be required in array form
            url:String,
            mimetype:String,      //so that it can be of pdf string and images
            size:Number
        }],
        default:[]
    }
},
{timestamps:true},
)

export const Task = mongoose.model("Task",taskSchema)