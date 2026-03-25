import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Place } from "../models/place.model.js";
import { User } from "../models/user.model.js";


/*
1. create place
2. get nearby place
3. get palce by id
4. update place
5. delete place
*/


const createPlace = asyncHandler(async(req ,res)=>{
    const {name,description,location,images,address,city,state,country} =req.body;

    const addedBy = req.User?._id;

    if(!name || !description || !location || !address || !city || !state || !country){
        throw new ApiError(400,"All fields are required")
    }

    const place=await Place.create({
        name,
        description,
        location,
        images,
        address,
        city,
        state,
        country,
        addedBy
    })

    return res.status(201).json(
        new ApiResponse(201,place,"Place created successfully")
    )
        
})

export default{createPlace};

