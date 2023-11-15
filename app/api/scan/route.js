import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import User from "@/models/users";
import Release from "@/models/release";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {barcode_text} = await request.json();
        const item = await Item.findOne({barcode_text: barcode_text, deletedAt: null}).exec();
        if (!item) {
            return NextResponse.json({message: 'Item not found.'}, {status: 401});
        }
        const inventory = await Inventory.find({item: item, deletedAt: null}).populate('user').exec();
        const released = await Release.find({inventory: {$in: inventory}, deletedAt: null}).populate('inventory').populate('employee').populate('department').populate('user').exec();
        return NextResponse.json({message: 'Item found.', item: item, stock: inventory, releases: released});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}