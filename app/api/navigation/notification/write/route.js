import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const token = await request.cookies.get('token')?.value || '';
        const {message} = await request.json();
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const notif = {
            user: user,
            message: message
        }
        const result = await Notification.create(notif);
        if (!result) {
            return NextResponse.json({message: 'Failed to create notification'}, {status: 401});
        }
        return NextResponse.json({message: 'Notification succcessfully created'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}