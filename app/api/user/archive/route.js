import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const data = await User.find({deletedAt: {$ne: null}}).exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const result = await User.findByIdAndUpdate(id, {deletedAt: null}).exec();
        if (!result) {
            return NextResponse.json({message: 'Restoration failed'}, {status: 401});
        }
        return NextResponse.json({message: 'Item restored'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}