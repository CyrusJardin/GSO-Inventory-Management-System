import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import Department from "@/models/department";
import Employee from "@/models/employees";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const items = await Item.find({deletedAt:null}).exec();
        const employees = await Employee.find({deletedAt:null}).exec();
        return NextResponse.json({message: 'OK', items: items, employees: employees}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}