import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {first_name, last_name, username, current_password, position} = await request.json();
        await connectMongoDB();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const salt = await bcryptjs.genSalt(10);
        const password = await bcryptjs.hash(current_password, salt);
        const user = await User.findOneAndUpdate({_id: decoded.payload.id}, {first_name: first_name,
            last_name: last_name, username: username, position: position, password: password}).exec();
        if (!user) {
            return NextResponse.json({message: 'Failed to update User'}, {status: 402});
        }
        const notif = {
            user: user,
            message: 'You have updated your profile.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Profile successfully updated'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}