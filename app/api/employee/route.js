import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Item from "@/models/items";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongoDB();
        const department = await Department.find({deletedAt: null}).exec();
        const employees = await Employee.find({deletedAt: null, department: {$in: department}}).populate('department').exec();
        return NextResponse.json({message: 'OK', data: employees}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST (request) {
    try {
        await connectMongoDB();
        const {first_name, last_name, position, employment_status, dep} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const department = await Department.findById(dep).exec();
        const employeeAlreadyExists = await Employee.findOne({first_name: first_name, last_name: last_name, department: department}).exec();
        if (employeeAlreadyExists) {
            return NextResponse.json({message: 'Employee already exists'}, {status: 402});
        }
        const result = await Employee.create({first_name, last_name, position, employment_status, department});
        if (!result) {
            return NextResponse.json({message: 'Failed to create employee'}, {status: 401});
        }
        const notif = {
            user: user,
            message: 'You have created a new Employee.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Employee successfully created'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}