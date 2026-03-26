import { User } from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"



// one whole funtion to generatew both access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "user not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token");
    }
}



const registerUser = asyncHandler(async (req, res) => {
    // get user details


    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password || !fullname) {
        throw new ApiError(400, "all fields are required");
    }
    if(password.length<6){
        throw new ApiError(400,"password must be at least 6 characters long");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(400, "user already exists");
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,


    })


    const createdUser = await User.findById(user._id).select("-password,-refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user");
    }

    return res.status(201).json({
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        user: createdUser
    })

})



const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] })

    if (!user) {
        throw new ApiError(404, "user not found")
    }


    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(401, "invalid user credentials")

    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password,-refreshToken")


    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        // user:user,
        // accessToken,
        // refreshToken
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


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incommingToken) {
        throw new ApiError(401, "unauthorized")

    }


    try {
        const decodedToken = jwt.verify(incommingToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "invalid refresh token");
        }

        if (incommingToken !== user.refreshToken) {
            throw new ApiError(401, "invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken:newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, {}, "Access token refreshed "))



    } catch (error) {
        throw new ApiError(401, "invalid refresh token")
    }


})
export default { registerUser, loginUser, logoutUser,refreshAccessToken}