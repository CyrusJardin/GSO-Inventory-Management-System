import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {id, item_id, inventory_tag, source_fund, date_acquired, quantity, unit_cost,
            total_cost, stock, remarks} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        await connectMongoDB();
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const item = await Item.findOne({_id: item_id}).exec();
        const tcost = parseFloat(quantity) * parseFloat(unit_cost);
        const ics_are = tcost > 50000 ? 'are' : 'ics';
        const result = await Inventory.findOneAndUpdate({_id: id}, {item: item, inventory_tag: inventory_tag, 
            source_fund: source_fund, date_acquired: date_acquired, quantity: quantity, 
            unit_cost: unit_cost, total_cost: total_cost, stock: stock, remarks: remarks, 
            ics_are: ics_are}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to update Inventory.'}, {status: 400});
        }
        const notif = {
            user: user,
            message: 'You have updated an Inventory.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Inventory successfully updated'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}