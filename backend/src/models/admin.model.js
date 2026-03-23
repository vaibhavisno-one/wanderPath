import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
    type: {
        type: String,
        enum: ["place", "review", "visit"],
        required: true
    },
    targetModel: {
        type: String,
        enum: ["Place", "Review", "Visit"],
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "targetModel"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reason: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);