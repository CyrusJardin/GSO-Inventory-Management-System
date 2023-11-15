import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const {first_name, last_name, position} = await request.json();
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const result = await User.findOneAndUpdate({_id: decoded.payload.id}, {first_name: first_name, last_name: last_name, position: position}).exec();
        if(!result) {
            return NextResponse.json({message: 'Failed to update profile.'}, {status: 402});
        }
        const notif = {
            user: user,
            message: 'You have updated your Profile.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Profile updated successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}