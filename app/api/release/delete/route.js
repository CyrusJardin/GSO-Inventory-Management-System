import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const result = await Release.findByIdAndUpdate(id, {deletedAt: new Date()}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to delete release'}, {status: 401});
        }
        return NextResponse.json({message: 'Release is archived successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}