import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import User from "@/models/users";
import Department from "@/models/department";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        let {first_name, last_name, username, password, department} = await request.json();
        await connectMongoDB();
        const user = await Employee.findOne({username});
        if(user) {
            return NextResponse.json({message: 'Username already exists'}, {status: 400});
        }
        const role = 'user';
        department = await Department.findOne({department_name: department});
        await Employee.create({first_name, last_name, username, password, department});
        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(password, salt);
        await User.create({first_name, last_name, username, password, role});
        return NextResponse.json({message: 'Employee successfully added!'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}