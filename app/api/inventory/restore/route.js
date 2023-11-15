import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
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
        const result = await Inventory.findByIdAndUpdate(id, {deletedAt: null}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to restore Inventory'}, {status: 402});
        }
        const notif = {
            user: user,
            message: 'You have restored an Inventory from the Archive.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Inventory successfully restored'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}