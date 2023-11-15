import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Item from "@/models/items";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const result = await Employee.findByIdAndUpdate(id, {deletedAt: new Date()}).exec();
        if(!result) {
            return NextResponse.json({message: 'Failed to delete employee'}, {status: 401});
        }
        const notif = {
            user: user,
            message: 'You have deleted an Employee. You may view the deleted Employee in the archive.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Employee deleted successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}