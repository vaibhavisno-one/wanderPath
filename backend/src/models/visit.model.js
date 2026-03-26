import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place",
        required:true
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    userLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

visitSchema.index({ userLocation: "2dsphere" });

export default mongoose.model("Visit", visitSchema);