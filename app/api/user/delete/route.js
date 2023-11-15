import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        await User.findByIdAndUpdate(id, {deletedAt: new Date()}).exec();
        const data = await User.find({role: 'user'});
        return NextResponse.json({message: 'successfully deleted', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}