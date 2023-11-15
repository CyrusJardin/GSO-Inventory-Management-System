import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET (request) {
    try {
        await connectMongoDB();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const data = await Notification.find({user: user, deletedAt: null}).sort({createdAt: 'desc'}).exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}