import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import User from "@/models/users";
import Inventory from "@/models/inventory";
import Employee from "@/models/employees";
import Item from "@/models/items";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id, quantity} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const release = await Release.findOne({_id: id}).populate('inventory').populate('employee').exec();
        const ret = parseInt(release.returned) + parseInt(quantity);
        const qty = parseInt(release.quantity) - parseInt(quantity);
        const result = await Release.findOneAndUpdate({_id: id}, {quantity: qty, returned: ret}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to return Release'}, {status: 402});
        }
        const newRel = parseInt(release?.inventory?.release, 10) - parseInt(quantity, 10);
        const newStock = parseInt(release?.inventory?.stock, 10) + parseInt(quantity, 10);
        const newCost = parseFloat(newStock) * parseFloat(release?.inventory?.unit_cost);
        await Inventory.findOneAndUpdate({_id: release?.inventory?._id}, {stock: newStock, released: newRel, total_cost: newCost}).exec();
        const notif = {
            user: user,
            message: `Employee: ${release.employee.first_name+' '+release.employee.last_name} has returned ${quantity} Item(s) to Inventory.`
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Item returned successfully'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}