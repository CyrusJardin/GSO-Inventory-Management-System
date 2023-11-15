import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Employee from "@/models/employees";
import Inventory from "@/models/inventory";
import Department from "@/models/department";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const data = await Release.find({deletedAt: {$ne: null}}).exec();
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}