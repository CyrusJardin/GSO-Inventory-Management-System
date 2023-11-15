import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: [true, "first name is required"]
        },
        last_name: {
            type: String,
            required: [true, "last name is required"]
        },
        username: {
            type: String,
            required: [true, "username is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        default_password: String,
        last_active: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            default: 'user'
        },
        deletedAt: {
            type: Date,
            default: null
        },
        position: String,
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    {
        timestamps: true
    }
)

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;