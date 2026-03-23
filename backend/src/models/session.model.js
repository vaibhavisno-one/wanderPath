import mongoose,{Schema} from "mongoose";



const sessionSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    
    },
    sessionToken:{
        type:String,
        required:true,
        trim:true
    
    },
    userAgent:{
        type:String,
        required:true,
        trim:true
    },
    ipAddress:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        required:true
    }
})

export default Session = mongoose.model("Session",sessionSchema);