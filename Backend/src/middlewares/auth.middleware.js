import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async(req,res,next) => {
 
  try {
    
     const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
      console.log(req.Cookies?.acccessToken)
     if (!token) {
         throw new ApiError(402,"Unauthorized Request")
     } 
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user){
         throw new ApiError(500,"Error while authorizing user ")
     }
     req.user = user
     next()
   } catch (error) {
    
     if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    throw new ApiError(500, "Authorization Error");
   }

})