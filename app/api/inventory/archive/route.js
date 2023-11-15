import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const data = await Inventory.find({deletedAt: {$ne: null}}).populate('item').exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}