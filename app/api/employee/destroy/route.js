import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
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
        const result = await Employee.findOneAndDelete({_id: id}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to delete Employee'}, {status: 402});
        }
        const notif = {
            user: user,
            message: 'You have deleted Employee from the Archive'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Employee successfully deleted'}, 200);
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}