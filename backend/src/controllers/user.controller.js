import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";



const getMe = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,user,"User fetched successfully")
    )
})

const getUserById = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    const user = await User.findById(userId).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404,"User not found")
    }

    return res.status(200).json(
        new ApiResponse(200,user,"User fetched successfully")
    )
})

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,users,"Users fetched successfully")
    )
})


const updateProfile = asyncHandler(async(req,res)=>{
    const {fullname,email,avatar} = req.body
    const user = await User.findById(req.user?._id)

    if(fullname){
        user.fullname = fullname
    }
    if(email){
        user.email = email
    }
    if(avatar){
        user.avatar = avatar
    }

    await user.save()

    return res.status(200).json(
        new ApiResponse(200,user,"User updated successfully")
    )
})

const deleteUser = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    const user = await User.findByIdAndDelete(userId)

    if (req.user._id.toString() !== userId) {
        throw new ApiError(403, "Unauthorized");
    }
    return res.status(200).json(
        new ApiResponse(200,user,"User deleted successfully")
    )
})

export default {getMe,getAllUser,getUserById,updateProfile,deleteProfile}