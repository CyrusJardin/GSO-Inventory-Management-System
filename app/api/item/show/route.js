import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {barcode_text} = await request.json();
        const isItemValid = await Item.findOne({barcode_text});
        if(!isItemValid) {
            return NextResponse.json({message: 'Item not found'}, {status: 401});
        }
        return NextResponse.json({message: 'Item found', data: isItemValid}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}