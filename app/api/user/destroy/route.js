import connectMongoDB from "@/libs/mongodb";
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
        const user = await User.findOne({_id: id}).exec();
        const usr = await User.findOne({_id: decoded.payload.id}).exec();
        if (!user) {
            return NextResponse.json({message: 'Can not find User'}, {status: 402});
        }
        const notif = {
            user: usr,
            message: 'You have permanently deleted a User.'
        }
        await Notification.create(notif)
        return NextResponse.json({message: 'User has been permanently deleted'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}