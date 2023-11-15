import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import Department from "@/models/department";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import Notification from "@/models/notification";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {_id, first_name, last_name, position, employment_status, department} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const departmentObj = await Department.findOne({_id: department}).exec();
        const result = await Employee.findOneAndUpdate({_id: _id}, {first_name: first_name, last_name: last_name, position: position, employment_status: employment_status, department: departmentObj}).exec();
        if (!result) {
            return NextResponse.json({message: 'Employee update failed'}, {status: 401});
        } 
        const notif = {
            user: user,
            message: 'You have edited an Employee.'
        };
        await Notification.create(notif);
        return NextResponse.json({message: 'Employee successfully updated'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}