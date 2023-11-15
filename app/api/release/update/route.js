import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Inventory from "@/models/inventory";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Item from "@/models/items";
import User from "@/models/users";
import Notification from "@/models/notification";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST (request) {
    try {
        const {id, item_id, employee, release_date, quantity, remarks} = await request.json();
        const token = await request.cookies.get('token')?.value || '';
        const decoded = await jwt.decode(token, {complete: true});
        await connectMongoDB();
        const inventory = await Inventory.findOne({_id: item_id, deletedAt: null}).populate('item').exec();
        const emp = await Employee.findOne({_id: employee, deletedAt: null}).populate('department').exec();
        console.log(emp, inventory)
        const it = await Item.findOne({_id: inventory.item._id}).exec();
        const department = await Department.findOne({_id: emp.department._id}).exec();
        const user = await User.findOne({_id: decoded.payload.id}).exec();
        const result = await Release.findByIdAndUpdate(id, {
            inventory: inventory,
            employee: emp,
            item: it,
            department: department,
            user: user,
            quantity: quantity,
            release_date: release_date,
            remarks: remarks
        }).exec();
        if (!result) {
            return NextResponse.json({message: 'Failed to update'}, {status: 402});
        }
        const notif = {
            user: user,
            message: 'You have edited a Release'
        }
        await Notification.create(notif);
        return NextResponse.json({message: 'Release updated'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}