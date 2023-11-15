import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import User from "@/models/users";
import Notification from "@/models/notification";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {item_name, barcode_text, property_number, unit, description} = await request.json();
        const userToken = await request.cookies.get('token')?.value || '';
        const isItemAlreadyExist = await Item.findOne({barcode_text: barcode_text}).exec();
        const token = await jwt.decode(userToken, {complete: true});
        const user = await User.findOne({_id: token.payload.id}).exec();
        if(isItemAlreadyExist) {
            return NextResponse.json({message: 'Already exists', data: isItemAlreadyExist}, {status: 401});
        }
        await Item.create({user, item_name, barcode_text, property_number, unit, description});
        const notif = {
            user: user,
            message: 'You have created a new item.'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Item successfully created'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}