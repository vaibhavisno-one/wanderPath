import mongoose,{Schema} from "mongoose";

const reviewSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    place:{
        type:Schema.Types.ObjectId,
        ref:"Place",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        trim:true
    },
    images:{
        type:[String],
        default:[]
    },
    visit:{
        type:Schema.Types.ObjectId,
        ref:"Visit",
        required:true // currently not confirmed that this should be true or false
    },
    approved:{
        type:Boolean,
        default:false
    },
    flagged:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

reviewSchema.index({ user: 1, place: 1 }, { unique: true });
reviewSchema.index({ place: 1, approved: 1 });

export default mongoose.model("Review",reviewSchema);
