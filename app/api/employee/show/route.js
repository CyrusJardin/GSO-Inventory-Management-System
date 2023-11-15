import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const data = await Employee.findOne({_id: id}).exec();
        const departments = await Department.find({}).exec();
        return NextResponse.json({message: 'OK', data: data, departments: departments}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}