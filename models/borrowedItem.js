import mongoose, { Schema, mongo } from "mongoose";
import Inventory from "./inventory";

const borrowedItemSchema = new Schema(
    {
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: [true, 'inventory is required']
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'employee is required']
        },
        date_borrowed: {
            type: Date,
            default: Date.now()
        },
        date_returned: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const BorrowedItem = mongoose.models.BorrowedItem || mongoose.model('BorrowedItem', borrowedItemSchema);

export default BorrowedItem;