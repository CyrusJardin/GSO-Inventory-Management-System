import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Department from "@/models/department";

export async function GET () {
    try {
        await connectMongoDB();
        const data = await Department.find({deletedAt: null}).exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: error.message}, {status: 500});
    }
}