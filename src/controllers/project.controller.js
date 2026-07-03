import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {ProjectMember} from '../models/projectmember.modles.js';
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from 'mongoose';
import { UserRolesEnum } from '../utils/constants.js';

const getProjects = asyncHandler(async(req,res) => {
  //test
})
const getProjectById = asyncHandler(async(req,res) => {
 //test
})
const createProject = asyncHandler(async(req,res) => {
 const {name, description} = req.body
  const project = await Project.create({
    name,
    description,
    createdBy:new mongoose.Types.ObjectId(req.user_id),  //this ensures that whtever objectId we are passing that  is 100% mongoogse objectId

  });
  await ProjectMember.create({
    user:new mongoose.Types.ObjectId(req.user_id),
    project:new mongoose.Types.ObjectId(project._id),
    role:UserRolesEnum.ADMIN
  })  

  return res
     .status(201)
     .json(
        new ApiResponse(
            201,
            project,
            "Project created sucessfully"
        )
     )
})

const updateProject = asyncHandler(async(req,res) =>{
  const {name,description} = req.body
  const{projectId} = req.params


  const project = await Project.findByIdAndUpdate(
    projectId,
      {
        name,
        description
    },
    {new:true}
  );
  if(!project){
    throw new ApiError(404,"Project not found")
  }
  return res
     .status(200)
     .json(
      new ApiResponse(
        200,
        project,
        "Project updated successfully"
      )
     )

})
const deleteProject = asyncHandler(async(req,res)=>{
    const{projectId} = req.params
    const project = await Project.findByIdAndDelete(projectId)

    if(!project){
    throw new ApiError(404,"Project not found")
  }
  return res
     .status(200)
     .json(
      new ApiResponse(
        200,
        project,
        "Project deleted successfully"
      )
     )
})
const addMemberToProject = asyncHandler(async(req,res) => {
 //test
})
const getProjectMembers = asyncHandler(async(req,res) =>{
 //test   
})
const updateMemberRole = asyncHandler(async(req,res) => {
 //test
})
const delteMember = asyncHandler(async(req,res) => {
 //test
})

export {
    addMemberToProject,
    createProject,
    delteMember,
    getProjects,
    getProjectById,
    getProjectMembers,
    updateProject,
    deleteProject,
    updateMemberRole
}

