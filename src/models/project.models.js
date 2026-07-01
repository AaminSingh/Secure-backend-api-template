import mongoose from "mongoose";
const projectSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,    //I will refer to another document itself
        ref:"User",
        required:true   
    }   
},{
    timestamps:true},
)


export const Project = mongoose.model("Project",projectSchema)

