'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import Link from "next/link";
import axios from "axios";
import DateFrame from "@/app/components/dateFrame";
import { useEffect, useState } from "react";
import BarcodeImage from "@/app/components/barcodeImage";
import { ImSpinner10 } from "react-icons/im";
import Swal from "sweetalert2";
import { TbRulerMeasure } from "react-icons/tb";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function Item () {

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const confirmDelete = id => {
        Swal.fire({
            title: 'Continue?',
            icon: 'warning',
            text: 'Are you sure you want to delete Item? Deleting an Item may affect Inventory and Release records.',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                deleteItem(id)
            }
        })
    }

    const deleteItem = async (id) => {
        try {
            setIsLoading(true)
            await axios.post('/api/item/delete', {id:id})
            .then(res=>{
                setItems(res.data.data)
                Swal.fire(res.data.message)
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
    
    const getItems = async () => {
        try {
            setIsLoading(true)
            await axios.get('/api/item')
            .then(res=>{
                setItems(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        getItems()
    },[])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full flex gap-2 bg-indigo-900/10 border border-white p-6 rounded-lg shadow-md">
                    <Link
                        href={'/data-entry/item/create'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-blue-600 text-center text-white hover:bg-blue-600/80"
                    >
                        new item
                    </Link>
                </div>
                <div className="w-full bg-indigo-900/10 border border-white text-white p-6 rounded-lg h-96 overflow-scroll shadow-md relative">
                    <table className="w-full table-auto">
                        <thead className="bg-slate-800 text-gray-400 border border-slate-600">
                            <tr>
                                <th>Added By</th>
                                <th>Item Name</th>
                                <th>Barcode</th>
                                <th>Property Number</th>
                                <th>Date Acquired</th>
                                <th>Unit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            isLoading ?
                            <tr>
                                <td colSpan={7} className="absolute w-full h-full flex justify-center items-center">
                                    <ImSpinner10 className="w-5 h-5 animate-spin" />
                                </td>
                            </tr>
                            :
                            items.map((item, id)=>{
                                return (
                                    <tr key={id} className="hover:bg-gray-900/50 hover:text-white">
                                        <td className="p-2 border border-slate-600">{item?.user?.first_name} {item?.user?.last_name}</td>
                                        <td className="p-2 border border-slate-600">{item?.item_name}</td>
                                        <td className="p-2 border border-slate-600"><BarcodeImage code={item?.barcode_text} /></td>
                                        <td className="p-2 border border-slate-600">{item?.property_number}</td>
                                        <td className="p-2 border border-slate-600"><DateFrame dateStr={item?.createdAt} /></td>
                                        <td className="p-2 border border-slate-600">{item?.unit}</td>
                                        <td className="p-2 border border-slate-600 h-auto text-white space-y-2">
                                            <Link
                                                href={`/data-entry/item/edit/${item?._id}`}
                                                className="block p-2 rounded-lg text-center bg-green-600 hover:bg-green-900"
                                            >
                                                <HiPencilSquare className="w-6 h-6" />
                                            </Link>
                                            <button
                                                className="p-2 rounded-lg bg-red-600 hover:bg-red-900"
                                                onClick={()=>confirmDelete(item?._id)}
                                            >
                                                <HiTrash className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}