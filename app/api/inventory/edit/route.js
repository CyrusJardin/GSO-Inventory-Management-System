import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import User from "@/models/users";
import Employee from "@/models/employees";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {id} = await request.json();
        await connectMongoDB();
        const data = await Inventory.findOne({_id: id}).populate('item').populate('employee').exec();
        const items = await Item.find({deletedAt: null}).exec();
        if (!data) {
            return NextResponse.json({message: 'Inventory not found.'}, {status: 401});
        }
        return NextResponse.json({message: 'OK', data: data, item: items}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}