import mongoose from "mongoose"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async (req,res) => {
  
  

})

const loginUser = asyncHandler(async(req,res) => {

})

const logoutUser = asyncHandler(async (req,res) => {

})



export {
    registerUser,
    loginUser,
    logoutUser,
}