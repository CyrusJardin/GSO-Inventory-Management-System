import Release from "@/models/release";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Item from "@/models/items";
import Inventory from "@/models/inventory";
import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";

export async function POST (request) {
    try {
        const {id} = await request.json();
        await connectMongoDB();
        const data = await Release.findOne({_id: id, deletedAt: null}).populate('employee').populate('inventory').populate('item').exec();
        if (!data) {
            return NextResponse.json({message: 'Can not find Released Item'}, {status: 402});
        }
        const employees = await Employee.find({deletedAt: null}).exec();
        const inventory = await Inventory.find({deletedAt: null}).populate('item').exec();
        return NextResponse.json({message: 'OK', data: data, employee: employees, item: inventory}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}