import connectMongoDB from "@/libs/mongodb";
import User from "@/models/users";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {username, password} = await request.json();
        await connectMongoDB();
        const user = await User.findOneAndUpdate({username}, {last_active: new Date()});
        if(!user) {
            return NextResponse.json({message: "Invalid username"}, {status: 401});
        }
        const passwordValid = await bcryptjs.compare(password, user.password);
        if(!passwordValid) {
            return NextResponse.json({message: "Invalid password"}, {status: 402});
        }
        const userData = {
            id: user._id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
        }
        const response = NextResponse.json({message: "Login successfully"}, {success: true});
        const token = jwt.sign(userData, process.env.TOKEN_SECRET_KEY, {expiresIn: "1d"});
        response.cookies.set("token", token, {httpOnly:true});
        return response;
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}