import connectMongoDB from "@/libs/mongodb";
import Employee from "@/models/employees";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const data = await Employee.find({deletedAt: {$ne: null}}).populate('department').exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const result = await Employee.findByIdAndUpdate(id, {deletedAt: null}).exec();
        if (!result) {
            return NextResponse.json({message: 'Restoration failed'}, {status: 401});
        }
        return NextResponse.json({message: 'Employee restored successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}