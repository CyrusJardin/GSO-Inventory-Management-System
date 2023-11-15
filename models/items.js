import mongoose, { Schema } from "mongoose";
import User from "./users";

const itemSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'user is required']
        },
        item_name: {
            type: String,
            required: [true, 'item name is required'],
            unique: true
        },
        unit: {
            type: String,
            required: [true, 'item unit is required']
        },
        barcode_text: {
            type: String,
            required: [true, 'barcode is required'],
            unique: true
        },
        description: {
            type: [String],
            require: [true, 'description is required'],
        },
        property_number: {
            type: String,
            required: [true, 'property number is required'],
            unique: true
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

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;