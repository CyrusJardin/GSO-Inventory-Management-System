import connectMongoDB from "@/libs/mongodb";
import Release from "@/models/release";
import Inventory from "@/models/inventory";
import Item from "@/models/items";
import Employee from "@/models/employees";
import Department from "@/models/department";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        await connectMongoDB();
        const currentDate = new Date().getFullYear();
        let startDate = new Date(currentDate, 0, 1);
        let endDate = new Date(currentDate, 11, 31);
        let totalStockCost = 0;
        const totalCostArr = await Inventory.find({stock: {$gte: 1}, deletedAt: null}).populate('item').exec();
        const totalReleaseArr = await Release.find({inventory: {$in: totalCostArr}, deletedAt: null, release_date: {$gte: startDate, $lte: endDate}}).populate('inventory').exec();
        totalCostArr.map(item=>{
            totalStockCost += item?.total_cost
        })
        const items = await Item.find({deletedAt: null}).exec();
        return NextResponse.json({
            message: 'OK', 
            stock: totalCostArr,
            release: totalReleaseArr,
            total: totalStockCost,
            items: items
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}