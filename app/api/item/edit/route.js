import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id} = await request.json();
        const data = await Item.findOne({_id:id}).exec();
        if(!data) {
            return NextResponse.json({message: 'Item not found'}, {status: 401});
        }
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}