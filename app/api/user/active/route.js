import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET (request) {
    try {
        await connectMongoDB();
        const token = await request.cookies.get('admin')?.value || '';
        const decoded = jwt.decode(token, {complete: true});
        const currentDate = new Date();
        await User.findOneAndUpdate({_id: decoded.payload.id}, {last_active: currentDate.toUTCString()});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}