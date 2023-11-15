import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import User from "@/models/users";
import Inventory from "@/models/inventory";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {
            inventory_tag, quantity, unit_cost, total_cost, item_id, source_fund, remarks, date_acquired
        } = await request.json();
        await connectMongoDB();
        const item = await Item.findOne({_id: item_id}).exec();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = jwt.decode(token, {complete: true});
        const user = await User.findById(decoded.payload.id).exec();
        const stock = quantity;
        const total_amount = total_cost;
        const ics_are = total_cost > 50000 ? 'are' : 'ics';
        await Inventory.create({item, unit_cost, total_cost, quantity, stock, inventory_tag, user, date_acquired, source_fund, total_amount, ics_are, remarks});
        return NextResponse.json({message: 'inventory stock successfully added'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}