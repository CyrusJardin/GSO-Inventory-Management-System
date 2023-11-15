import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {id} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        await connectMongoDB();
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const notif = {
            user: user,
            message: 'You have deleted an Item. You may view the deleted Item in the archive.'
        }
        await Item.findByIdAndUpdate(id, {deletedAt: new Date()});
        const newItems = await Item.find({deletedAt: null}).populate('user').exec();
        await Notification.create(notif);
        return NextResponse.json({message: 'Item deleted successfully', data: newItems}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}