import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import Employee from "@/models/employees";
import User from "@/models/users";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function GET (request) {
    try {
        await connectMongoDB();
        const items = await Item.find({deletedAt: null}).populate('user').exec();
        return NextResponse.json({message: 'OK', data: items}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const item = await Item.findById(id).populate('employee').exec();
        return NextResponse.json({message: 'OK', data: item}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}