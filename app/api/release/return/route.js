import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import User from "@/models/users";
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
        const release = await Release.findOne({_id: id}).populate('employee').exec();
        const ret = parseInt(release.returned) + parseInt(quantity);
        const qty = parseInt(release.quantity) - parseInt(quantity);
        const result = await Release.findOneAndUpdate({_id: id}, {quantity: qty, returned: ret}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to return Release'}, {status: 402});
        }
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