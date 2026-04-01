import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        minlength:3,
        maxlength:30
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    visitedPlaces:[{
        type:Schema.Types.ObjectId,
        ref:"Place"
    }],
    refreshToken:{
        type:String,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, {timestamps:true})

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10) //what to hash and rounds?
    next()
})
//method to check pass where ever needed
userSchema.methods.isPasswordCorrect= async function 
(password){
    return await bcrypt.compare(password, this.password) 
}

//method to generate access token


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export default User = mongoose.model("User",userSchema);