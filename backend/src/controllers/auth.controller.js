import User from "../models/user.model"


const registerUser = asyncHandler(async(req, res)=>{
    // get user details


    const {username,email,password,fullname} = req.body;

    if(!username||!email||!password||!fullname){
        throw new ApiError(400,"all fields are required");
    }

    const existingUser = await User.findOne({email,username});

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



export default {registerUser}