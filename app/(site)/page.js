'use client'

import SideNav from "../components/navigation/sideNav"
import TopNav from "../components/navigation/topNav"
import CardDataSet from "../components/dashboard/cardDataSet"
import { IoTodayOutline } from "react-icons/io5"
import ChartCard from "../components/dashboard/chartCard"
import BorrowedItemChart from "../components/dashboard/borrowedItemChart"
import { useEffect, useState } from "react"
import axios from "axios"
import { TodayDate, getWeeklyRelease, getWeeklyStocks, isDateThisMonth } from "../hooks/todayDate"
import { ImSpinner10 } from "react-icons/im"
import BarcodeImage from "../components/barcodeImage"

export default function Page () {

    const [inventoryDetails, setInventoryDetails] = useState({
        today: 0,
        today_percent: 0,
        week: 0,
        week_percent: 0,
        month: 0,
        month_percent: 0,
        year: 0,
        year_percent: 0,
        weekly_cost: [],
        weekly_release: []
    })
    const [itemSummarySelect, setItemSummarySelect] = useState([])
    const [selectedItemSummary, setSelectedItemSummary] = useState({
        property_number: '',
        description: [''],
        barcode_text: 'sample'
    })
    const [availableStocks, setAvailableStocks] = useState([])
    const [isStockLoading, setIsStockLoading] = useState(false)

    const onSelectedItemSummaryChange = e => {
        e.preventDefault()
        const index = e.target.value
        if (index == '' || index == null) {
            setSelectedItemSummary({
                property_number: '',
                description: [''],
                barcode_text: 'sample'
            })
        } else {
            const items = [...itemSummarySelect]
            setSelectedItemSummary(items[index])
        }
    }

    const processWeek = (arr, totalStock) => {
        const week_cost = getWeeklyStocks(arr)
        const week_release = getWeeklyRelease(arr)
        let today = 0
        let week = 0
        let month = 0
        let year = 0
        const currentDate = new Date()
        let startDate = new Date(currentDate)
        let endDate = new Date(currentDate)
        startDate.setDate(currentDate.getDate() - currentDate.getDay())
        endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()))
        arr.map(element => {
            if(TodayDate(element?.createdAt)) {
                today += element?.total_cost
            }
            if(new Date(element?.createdAt) >= startDate && new Date(element?.createdAt) <= endDate) {
                week += element.total_cost
            }
            if(isDateThisMonth(element?.createdAt)) {
                month += element?.total_cost
            }
            if(new Date(element?.createdAt).getFullYear() == new Date().getFullYear()) {
                year += element?.total_cost
            }
        })
        const today_percent = (today/totalStock) * 100
        const week_percent = (week/totalStock) * 100
        const month_percent = (month/totalStock) * 100
        const year_percent = (year/totalStock) * 100
        setInventoryDetails({
            today: today,
            today_percent: today_percent,
            week: week,
            week_percent: week_percent,
            month: month,
            month_percent: month_percent,
            year: year,
            year_percent: year_percent,
            weekly_cost: week_cost,
            weekly_release: week_release
        })
    }

    useEffect(()=>{
        const getData = async () => {
            try {
                setIsStockLoading(true)
                await axios.get('/api/dashboard')
                .then(res=>{
                    console.log(res)
                    processWeek(res.data.stock, res.data.total)
                    setItemSummarySelect(res.data.items)
                    setAvailableStocks(res.data.stock)
                    setIsStockLoading(false)
                })
                .catch(err=>{
                    console.log(err)
                    setIsStockLoading(false)
                })
            } catch (error) {
                console.log(error)
                setIsStockLoading(false)
            }
        }
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute top-20 right-0 w-full md:w-4/5 p-6">
                {/* <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                    <CardDataSet 
                        title="Today Cost" 
                        total={inventoryDetails.today.toLocaleString('en-US')} 
                        rate={inventoryDetails.today_percent.toLocaleString('en-US')} 
                        levelUp
                    >
                        <IoTodayOutline />
                    </CardDataSet>
                    <CardDataSet 
                        title="Weekly Cost" 
                        total={inventoryDetails.week.toLocaleString('en-US')} 
                        rate={inventoryDetails.week_percent.toLocaleString('en-US')}
                        levelUp
                    >
                        <IoTodayOutline />
                    </CardDataSet>
                    <CardDataSet 
                        title="Monthly Cost" 
                        total={inventoryDetails.month.toLocaleString('en-US')} 
                        rate={inventoryDetails.month_percent.toLocaleString('en-US')} 
                        levelUp
                    >
                        <IoTodayOutline />
                    </CardDataSet>
                    <CardDataSet 
                        title="Yearly Cost" 
                        total={inventoryDetails.year.toLocaleString('en-US')}
                        rate={inventoryDetails.year_percent.toLocaleString('en-US')}
                        levelUp
                    >
                        <IoTodayOutline />
                    </CardDataSet>
                </div> */}
                <div className="mt-2 grid grid-cols-12 gap-2">
                    <ChartCard />
                    <BorrowedItemChart stock={inventoryDetails.weekly_cost} release={inventoryDetails.weekly_release} />
                </div>
                <div className="mt-2 grid grid-cols-12 gap-2">
                    <div className="w-full col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
                        <p className="text-center text-xl font-bold">Item Summary</p>
                        <div className="w-full">
                            <select
                                className="w-full rounded-lg p-2 border hover:border-black"
                                onChange={onSelectedItemSummaryChange}
                            >
                                <option></option>
                                {
                                    itemSummarySelect.map((item,index)=>{
                                        return (
                                            <option key={index} value={index}>{item.item_name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className="w-full p-6 h-96 overflow-y-scroll space-y-4">
                                <p><span className="font-bold">Property Number:</span> {selectedItemSummary.property_number}</p>
                                <p><span className="font-bold">Unit:</span> {selectedItemSummary.unit}</p>
                                <p className="font-bold">Barcode:</p>
                                <BarcodeImage code={selectedItemSummary.barcode_text} />
                                <p className="font-bold">Description:</p>
                                {
                                    selectedItemSummary.description.map((item,index)=>{
                                        return <p className="border-b border-slate-900" key={index}>*{item}</p>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-6">
                        <p className="text-center text-xl font-bold">Available Stocks</p>
                        <div className="w-full h-96 overflow-scroll relative">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-600 text-gray-300">
                                    <tr>
                                        <th>Item</th>
                                        <th>Inventory Tag</th>
                                        <th>Unit Cost</th>
                                        <th>Stocks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isStockLoading ?
                                        <tr className="absolute w-full h-full bg-slate-900 text-white flex justify-center items-center">
                                            <td colSpan={4}><ImSpinner10 className="w-5 h-5 animate-spin" /></td>
                                        </tr>
                                        :
                                        availableStocks.map((item,index)=>{
                                            return (
                                                <tr key={index} className="border-b border-slate-900">
                                                    <td className="p-2">{item?.item?.item_name}</td>
                                                    <td className="p-2">{item?.inventory_tag}</td>
                                                    <td className="p-2">{item?.unit_cost}</td>
                                                    <td className="p-2">{item?.stock}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}