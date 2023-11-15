import connectMongoDB from "@/libs/mongodb";
import Notification from "@/models/notification";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        await Notification.findByIdAndUpdate(id, {deletedAt: new Date()}).exec();
        return NextResponse.json({message: 'OK'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}