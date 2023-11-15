import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        const {password} = await request.json();
        const admin = await request.cookies.get('admin')?.value || '';
        await connectMongoDB();
        const user = await User.findOne({username: 'admin'});
        if(!user) {
            return NextResponse.json({message: 'Can not find user'}, {status: 401});
        }
        const passwordDidMatch = await bcryptjs.compare(password, user.password);
        if(!passwordDidMatch) {
            return NextResponse.json({message: 'Password did not match'}, {status: 402});
        }
        return NextResponse.json({message: 'Password match'}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}