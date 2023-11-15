import mongoose, { Schema } from "mongoose";
import User from "./users";

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'user is required']
        },
        status: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: [true, 'message is required']
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;