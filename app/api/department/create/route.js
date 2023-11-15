import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Department from "@/models/department";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {department_name, office_name} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const office = {
            department_name: department_name,
            office_name: office_name
        }
        const departmentExists = await Department.findOne({department_name: department_name, office_name: office_name}).exec();
        if (departmentExists) {
            return NextResponse.json({message: 'Already exists'}, {status: 402});
        }
        const result = await Department.create(office);
        if(!result) {
            return NextResponse.json({message: 'Failed'}, {status: 401});
        }
        const notif = {
            user: user,
            message: 'You have created a new Department.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Department successfully added'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}