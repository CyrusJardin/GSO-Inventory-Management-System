import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Department from "@/models/department";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {_id} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const notif = {
            user: user,
            message: 'You have deleted a Department. You may view the deleted Department on archive.'
        }
        await Department.findByIdAndUpdate(_id, {deletedAt: new Date()}).exec();
        await Notification.create(notif);
        return NextResponse.json({message: 'Department successfully deleted'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}