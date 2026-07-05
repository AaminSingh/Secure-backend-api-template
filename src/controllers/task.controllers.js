import {User} from '../models/user.models.js';
import {Project} from '../models/project.models.js';
import {Task} from '../models/task.models.js';
import {Subtask} from '../models/subtask.models.js';
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from 'mongoose';
import { AvailableUserRoles, UserRolesEnum } from '../utils/constants.js';

const getTasks = asyncHandler(async(req,res)=>{
    //task
})
const createTask = asyncHandler(async(req,res)=>{
    //task
})
const getTaskById = asyncHandler(async(req,res)=>{
    //task
})
const updateTask = asyncHandler(async(req,res)=>{
    //task
})
const deleteTask = asyncHandler(async(req,res)=>{
    //task
})
const createSubTask = asyncHandler(async(req,res)=>{
    //task
})
const updateSubTask = asyncHandler(async(req,res)=>{
    //task
})
const deleteSubtask = asyncHandler(async(req,res)=>{
    //task
})

export {
    createTask,
    createSubTask,
    deleteTask,
    deleteSubtask,
    getTaskById,
    getTasks,
    updateTask,
    updateSubTask
}