'use client';

import BarcodeImage from "@/app/components/barcodeImage";
import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";
import { ImSpinner10 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Inventory () {

    const [stocks, setStocks] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const archiveStock = async (id) => {
        try {
            await axios.post('/api/inventory/delete', {id:id})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const getData = async () => {
        try {
            setIsLoading(true)
            await axios.get('/api/inventory/index')
            .then(res=>{
                console.log(res.data)
                setStocks(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-indigo-900/10 border border-white rounded-lg p-6 shadow-md flex gap-2">
                    <Link
                        href={'/inventory/stock'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-center text-white"
                    >
                        add stock
                    </Link>
                    <Link
                        href={'/inventory/release'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-600/80 text-center text-white"
                    >
                        release item
                    </Link>
                    {/* <Link
                        href={'/inventory/archive'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-red-600 hover:bg-red-600/80 text-center text-white"
                    >
                        archive
                    </Link> */}
                </div>
                <div className="w-full bg-indigo-900/10 border border-white text-white rounded-lg p-6 shadow-md h-96 overflow-scroll relative">
                    <p className="text-2xl font-bold">Stocks</p>
                    <table className="w-full table-auto border border-slate-600">
                        <thead className="bg-slate-800 text-gray-400">
                            <tr>
                                <th>Item Name</th>
                                <th>Barcode</th>
                                <th>ICS / ARE</th>
                                <th>Unit Cost</th>
                                <th>Total Cost</th>
                                <th>Property Number</th>
                                <th>Date</th>
                                <th>Stocks</th>
                                <th>Released</th>
                                <th>Condemned</th>
                                <th>Inventory Tag</th>
                                <th>Source of Funds</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ?
                                <tr>
                                    <td colSpan={13} className="absolute w-full h-full flex justify-center items-center">
                                        <ImSpinner10 className="w-5 h-5 animate-spin" />
                                    </td>
                                </tr>
                                :
                                stocks.map((item,id)=>{
                                    return(
                                        <tr key={id} className="hover:bg-gray-900/50 hover:text-white border border-slate-600">
                                            <td className="p-2 border border-slate-600">{item?.item?.item_name}</td>
                                            <td className="p-2 border border-slate-600 min-w-[230px]"><BarcodeImage code={item?.item?.barcode_text} /></td>
                                            <td className="p-2 border border-slate-600">{item?.ics_are}</td>
                                            <td className="p-2 border border-slate-600">{item?.unit_cost}</td>
                                            <td className="p-2 border border-slate-600">{item?.total_cost}</td>
                                            <td className="p-2 border border-slate-600">{item?.item?.property_number}</td>
                                            <td className="p-2 border border-slate-600"> <DateFrame dateStr={item?.date_acquired} /> </td>
                                            <td className="p-2 border border-slate-600">{item?.stock}</td>
                                            <td className="p-2 border border-slate-600">{item?.released}</td>
                                            <td className="p-2 border border-slate-600">{item?.condemned}</td>
                                            <td className="p-2 border border-slate-600">{item?.inventory_tag}</td>
                                            <td className="p-2 border border-slate-600">{item?.source_fund}</td>
                                            <td className="p-2 flex space-x-2 text-white">
                                                <Link
                                                    href={'/inventory/edit/'+item?._id}
                                                    className="block text-center w-1/2 p-2 rounded bg-green-600 hover:bg-green-600/80"
                                                >
                                                    <HiPencilSquare className="w-6 h-6" />
                                                </Link>
                                                <button
                                                    onClick={()=>archiveStock(item?._id)}
                                                    className="w-1/2 p-2 rounded-lg bg-red-600 hover:bg-red-600/80"
                                                >
                                                    <HiTrash className="w-6 h-6" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}