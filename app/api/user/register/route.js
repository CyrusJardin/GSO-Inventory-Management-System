import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {first_name, last_name, username, pword, position} = await request.json();
        const default_password = pword;
        await connectMongoDB();
        const salt = await bcryptjs.genSalt(10);
        const password = await bcryptjs.hash(pword, salt);
        await User.create({first_name, last_name, username, password, default_password, position});
        const data = await User.find({role: 'user'});
        return NextResponse.json({message: "User successfully created!", data: data}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}