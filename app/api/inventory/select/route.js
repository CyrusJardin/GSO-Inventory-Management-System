import connectMongoDB from "@/libs/mongodb";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import Employee from "@/models/employees";
import User from "@/models/users";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const items = await Item.find({deletedAt: null}).exec();
        const data = await Inventory.find({stock: {$gte: 1}, deletedAt: null, item: {$in: items}}).populate('item').exec();
        const department = await Department.find({deletedAt: null}).exec();
        const employees = await Employee.find({deletedAt: null, department: {$in: department}}).exec();
        return NextResponse.json({message: 'OK', data: data, employees: employees}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}