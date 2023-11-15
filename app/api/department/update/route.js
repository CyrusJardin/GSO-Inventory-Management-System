import connectMongoDB from "@/libs/mongodb";
import Department from "@/models/department";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {_id, department_name, office_name} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const result = await Department.findByIdAndUpdate(_id, {department_name: department_name, office_name: office_name}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to update Department. Please try again.'}, {status: 401});
        }
        const notif = {
            user: user,
            message: 'You have edited a Department.'
        };
        await Notification.create(notif);
        return NextResponse.json({message: 'Department successfully updated'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}