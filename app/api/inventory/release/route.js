import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Inventory from "@/models/inventory";
import Employee from "@/models/employees";
import Department from "@/models/department";
import User from "@/models/users";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Item from "@/models/items";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {employee, item_id, quantity, release_date, remarks} = await request.json();
        const employeeObj = await Employee.findOne({_id:employee}).exec();
        const inventoryObj = await Inventory.findOne({_id:item_id}).populate('item').exec();
        const itemObj = await Item.findOne({_id:inventoryObj.item._id}).exec();
        const department = await Department.findOne({_id:employeeObj.department}).exec();
        const token = await request.cookies.get('token')?.value || '';
        const userData = await jwt.decode(token, {complete: true});
        const userObj = await User.findOne({_id:userData.payload.id}).exec();
        const release = {
            inventory: inventoryObj,
            item: itemObj,
            employee: employeeObj,
            department: department,
            user: userObj,
            quantity: quantity,
            release_date: release_date,
            remarks: remarks
        }
        const result = await Release.create(release);
        if (!result) {
            return NextResponse.json({message: 'Release of item failed'}, {status: 401});
        }
        const stocks = parseInt(inventoryObj.stock) - parseInt(quantity);
        const borrowed = parseInt(inventoryObj.released) + parseInt(quantity);
        const totalCost = inventoryObj.unit_cost * stocks;
        await Inventory.findOneAndUpdate({_id: inventoryObj._id}, {stock: stocks, released: borrowed, total_cost: totalCost}).exec();
        return NextResponse.json({message: 'Item successfully released'}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}