import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        await Inventory.findByIdAndUpdate(id, {deletedAt: new Date()}).exec();
        return NextResponse.json({message: 'Successfully deleted'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}