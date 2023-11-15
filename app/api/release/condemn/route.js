import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Inventory from "@/models/inventory";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {id, quantity} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        await connectMongoDB();
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const release = await Release.findOne({_id: id}).populate('employee').exec();
        const inventory = await Inventory.findOne({_id: release.inventory}).exec();
        const qty = parseInt(release.quantity) - parseInt(quantity);
        const con = parseInt(inventory.condemned) + parseInt(quantity);
        const rel = parseInt(inventory.released) - parseInt(quantity);
        const result = await Release.findOneAndUpdate({_id: id}, {quantity: qty}).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to reduce quantity'}, {status: 402});
        }
        const addCondemned = await Inventory.findOneAndUpdate({_id: inventory._id}, {condemned: con, released: rel}).exec();
        if (!addCondemned) {
            return NextResponse.json({message: 'Failed to add condemned'}, {status: 403});
        }
        const notif = {
            user: user,
            message: 'You have returned a condemned Item from Employee.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Condemned Item successfully returned'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}