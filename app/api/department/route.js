import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Employee from "@/models/employees";
import Department from "@/models/department";
import Item from "@/models/items";
import Inventory from "@/models/inventory";
import Release from "@/models/release";

export async function GET () {
    try {
        await connectMongoDB();
        const employees = await Employee.find({deletedAt: null}).populate('department').exec();
        return NextResponse.json({message: 'OK', data: employees}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function POST (request) {
    try {
        await connectMongoDB();
        const {month, year, department} = await request.json();
        let data = '';
        const item = await Item.find({deletedAt:null}).exec();
        const employee = await Employee.find({deletedAt:null}).exec();
        const dep = await Department.find({deletedAt:null}).exec();
        const inv = await Inventory.find({deletedAt:null}).exec();
        let startDate = new Date(year+'-01-01');
        let endDate = new Date(year+'-12-31');
        if(!month && !department) {
            data = await Release.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                },
                deletedAt: null,
                item: {$in: item},
                employee: {$in: employee},
                department: {$in: dep},
                inventory: {$in: inv}
            }).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
        }
        else if(!month) {
            const departmentObj = await Department.find({department_name: department});
            data = await Release.find({
                department: {$in: departmentObj},
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                },
                deletedAt: null,
                item: {$in: item},
                employee: {$in: employee},
                inventory: {$in: inv}
            }).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
        }
        else if(!department) {
            startDate = new Date(year+'-'+month+'-01');           
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
            data = await Release.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                },
                deletedAt: null,
                item: {$in: item},
                employee: {$in: employee},
                inventory: {$in: inv}
            }).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
        }
        else {
            startDate = new Date(year+'-'+month+'-01');           
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
            const departmentObj = await Department.find({department_name: department});
            data = await Release.find({
                department: {$in: departmentObj},
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                },
                deletedAt: null,
                item: {$in: item},
                employee: {$in: employee},
                inventory: {$in: inv}
            }).populate('inventory').populate('item').populate('employee').populate('department').sort([['release_date', -1]]).exec();
        }
        return NextResponse.json({message: 'OK', data: data}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}