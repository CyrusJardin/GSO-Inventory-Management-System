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
        const currentDate = new Date();
        let startDate = new Date(currentDate);
        let endDate = new Date(currentDate);
        let totalStockCost = 0;
        const totalCostArr = await Inventory.find({stock: {$gte: 1}, deletedAt: null}).populate('item').exec();
        // const todayStock = await Inventory.find({stock: {$gte: 1}, createdAt: {$gte: new Date(), $lte: new Date()}}).exec();
        // startDate.setDate(currentDate.getDate() - currentDate.getDay());
        // endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
        // const weekStock = await Inventory.find({stock: {$gte: 1}, createdAt: {$gte: startDate, $lte: endDate}}).exec();
        // const weekRelease = await Release.find({createdAt: {$gte: startDate, $lte: endDate}}).populate('inventory').populate('item').exec();
        const totalReleaseArr = await Release.find({inventory: {$in: totalCostArr}}).populate('inventory').exec();
        totalCostArr.map(item=>{
            totalStockCost += item?.total_cost
        })
        const items = await Item.find({deletedAt: null}).exec();
        return NextResponse.json({
            message: 'OK', 
            // today: todayStock, 
            // weekStock: weekStock,
            // weekRelease: weekRelease,
            stock: totalCostArr,
            release: totalReleaseArr,
            total: totalStockCost,
            items: items
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}