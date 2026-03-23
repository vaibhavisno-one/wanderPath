import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    // avatar:{
    //     type:String,
    // },
    refreshToken:{
        type:String,
        
    },
    createdAt:{
        type:Date,
        
    },
    endedAt:{
        type:Date,
        
    }
})

//here i am hashing pass with bcryptjs

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);

    next();

})

//method to check pass wehere ever need 


userSchema.methods.isPasswordCorrect = async function(password){

    return await bcrypt.compare(password,this.password);

}


// method to generate access token 


userSchema.methods.generateAccessToken =async function(){

    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

)
}


// method for refresh token generation


userSchema.methods.generateRefreshToken =async function(){

    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}


export const User = mongoose.model("User",userSchema);