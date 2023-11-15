import connectMongoDB from "@/libs/mongodb";
import Department from "@/models/department";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {_id} = await request.json();
        const data = await Department.findOne({_id: _id}).exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}