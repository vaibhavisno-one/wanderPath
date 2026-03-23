import mongoose,{Schema} from "mongoose";

const bookmarkSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    place:{
        type:Schema.Types.ObjectId,
        ref:"Place",
        required:true
    }
},{timestamps:true});

bookmarkSchema.index({ user: 1, place: 1 }, { unique: true });

export default mongoose.model("Bookmark",bookmarkSchema);