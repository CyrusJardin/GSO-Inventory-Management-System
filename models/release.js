import mongoose, { Schema } from "mongoose";
import Inventory from "./inventory";
import Item from "./items";
import Department from "./department";
import Employee from "./employees";
import User from "./users";

const releaseSchema = new Schema(
    {
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: [true, 'inventory is required']
        },
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: [true, 'item is required']
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'employee is required']
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, 'department is required']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'user is required']
        },
        quantity: {
            type: Number,
            required: [true, 'quantity is required'],
            min: 0
        },
        release_date: {
            type: Date,
            default: Date.now()
        },
        returned: {
            type: Number,
            default: 0
        },
        deletedAt: {
            type: Date,
            default: null
        },
        remarks: String
    },
    {
        timestamps: true
    }
)

const Release = mongoose.models.Release || mongoose.model('Release', releaseSchema);

export default Release;