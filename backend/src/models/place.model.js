import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    location: {
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
    images: {
        type: [String],
        default: []
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: "India",
        trim: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
},{timestamps:true});

placeSchema.index({ location: "2dsphere" });

export default mongoose.model("Place", placeSchema);