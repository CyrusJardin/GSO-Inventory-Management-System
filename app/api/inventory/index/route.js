import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const employees = await Employee.find({deletedAt:null}).exec();
        const item = await Item.find({deletedAt:null}).exec();
        const data = await Inventory.find({deletedAt: null, item: {$in: item}}).populate('item').populate('user').exec();
        return NextResponse.json({message: 'OK', data: data, employees: employees}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}