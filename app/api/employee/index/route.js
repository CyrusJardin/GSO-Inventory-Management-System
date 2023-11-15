import connectMongoDB from "@/libs/mongodb";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Inventory from "@/models/inventory";
import Release from "@/models/release";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {
        await connectMongoDB();
        const {id, month, year} = await request.json();
        const item = await Item.find({deletedAt:null}).exec();
        const inventory = await Inventory.find({deletedAt: null, item: {$in: item}}).exec();
        const emp = await Employee.find({deletedAt:null}).exec();
        const department = await Department.find({deletedAt:null}).exec();
        let startDate = new Date(year+'-01-01');
        let endDate = new Date(year+'-12-31');
        if(!id && !month) {
            const data = await Release.find({
                release_date: {$gte: startDate, $lte: endDate}, 
                deletedAt: null, 
                inventory: {$in: inventory},
                employee: {$in: emp},
                department: {$in: department}
            }).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
            return NextResponse.json({message: 'OK', data: data}, {status: 201});
        }
        else if(!month) {
            const employee = await Employee.findOne({_id: id}).exec();
            const data = await Release.find({employee: employee, createdAt: {$gte: startDate, $lte: endDate}, deletedAt: null, inventory: {$in: inventory}, department: {$in: department}}).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
            return NextResponse.json({message: 'OK', data: data}, {status: 202});
        }
        else if(!id) {
            startDate = new Date(year+'-'+month+'-01');           
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
            const data = await Release.find({createdAt: {$gte: startDate, $lte: endDate}, deletedAt: null, employee: {$in: emp}, inventory: {$in: inventory}, department: {$in: department}}).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
            return NextResponse.json({message: 'OK', data: data}, {status: 200});
        }
        else {
            const employee = await Employee.findOne({_id: id}).exec();
            startDate = new Date(year+'-'+month+'-01');           
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
            const data = await Release.find({employee: employee, createdAt: {$gte: startDate, $lte: endDate}, deletedAt: null, inventory: {$in: inventory}, department: {$in: department}}).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
            return NextResponse.json({message: 'OK', data: data}, {status: 200});
        }
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}