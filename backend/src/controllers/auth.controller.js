import User from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



// one whole funtion to generatew both access and refresh token
const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new ApiError(404,"user not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token");
    }
}



const registerUser = asyncHandler(async(req, res)=>{
    // get user details


    const {username,email,password,fullname} = req.body;

    if(!username||!email||!password||!fullname){
        throw new ApiError(400,"all fields are required");
    }

    const existingUser = await User.findOne({
    $or: [{ email }, { username }]
});

    if(existingUser){
        throw new ApiError(400,"user already exists");
    }

    const user = await User.create({
        fullname,
        username:username.toLowerCase(),
        email:email.toLowerCase(),
        password,
        

    })


    const createdUser = await User.findById(user._id).select("-password,-refreshToken");

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user");
    }

    return res.status(201).json({
        statusCode:201,
        success:true,
        message:"User registered successfully",
        user:createdUser
    })
        
})



const loginUser = asyncHandler(async(req,res)=>{

    const {email,username, password} = req.body;

    const user = await User.findOne({$or:[{email},{username}]})

    if(!user){
        throw new APIError(404, "user not found")
    }


    const checkPassword = await user.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(401, "invalid user credentials")

    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password,-refreshToken")


    return res.status(200).json({
        success:true,
        message:"User logged in successfully",
        // user:user,
        accessToken,
        refreshToken
    })

})



const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }
    );

    return res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({
            statusCode: 200,
            message: "User logged out successfully"
        });
});
export default {registerUser,loginUser,logoutUser}