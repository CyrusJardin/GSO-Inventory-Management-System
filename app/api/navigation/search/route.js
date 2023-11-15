import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import Department from "@/models/department";
import Employee from "@/models/employees";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {search} = await request.json();
        const employee = await Employee.find({$or: [{first_name: {$regex: search, $options: 'i'}}, {last_name: {$regex: search, $options: 'i'}}]}).exec();
        const releases = await Release.find({employee: {$in: employee}}).populate('item').populate('employee').populate('department').exec();
        const items = await Item.find({item_name: {$regex: search, $options: 'i'}}).exec();
        const inventory = await Inventory.find({item: {$in: items}}).populate('item').exec();
        return NextResponse.json({message: 'OK', data: releases, stock: inventory, employee: employee}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}