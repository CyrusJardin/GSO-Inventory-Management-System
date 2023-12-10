'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Search ({ params }) {

    const [searchResult, setSearchResult] = useState([])
    const [itemResult, setItemResult] = useState([])

    useEffect(()=>{
        const getData = async () => {
            try {
                await axios.post('/api/navigation/search', {search: params.slug})
                .then(res=>{
                    setSearchResult(res.data.data)
                    setItemResult(res.data.stock)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-indigo-900/10 border border-white rounded-lg shadow-md p-6 flex">
                    <Link
                        href={'/'}
                        className="block w-full md:w-1/3 rounded-lg p-2 text-center text-white bg-indigo-900 hover:bg-indigo-900/80"
                    >
                        back
                    </Link>
                </div>
                <div className="w-full bg-indigo-900/10 border border-white text-white rounded-lg shadow-md p-6">
                    <p className="text-center text-gray-500">{searchResult.length + itemResult.length} Results of {params.slug}</p>
                    <div className="w-full h-96 overflow-scroll">
                        {
                            searchResult.length > 0 ? 
                            <p className="w-full bg-slate-900 text-white text-center">Release {searchResult.length} results</p>
                            :
                            <p className="w-full bg-slate-900 text-white text-center">Release no data</p>
                        }
                        {
                            searchResult.length > 0 &&
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Item Name</th>
                                        <th>Property Number</th>
                                        <th>Quantity</th>
                                        <th>Returned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        searchResult.map((item,index)=>{
                                            return(
                                                <tr key={index} className="border-b border-slate-900">
                                                    <td className="p-2">{item?.employee?.first_name} {item?.employee?.last_name}</td>
                                                    <td className="p-2">{item?.department?.department_name}</td>
                                                    <td className="p-2">{item?.item?.item_name}</td>
                                                    <td className="p-2">{item?.item?.property_number}</td>
                                                    <td className="p-2">{item?.quantity}</td>
                                                    <td className="p-2">{item?.returned}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        }
                        {
                            itemResult.length > 0 ? 
                            <p className="w-full bg-slate-900 text-white text-center">Inventory {itemResult.length} results</p>
                            :
                            <p className="w-full bg-slate-900 text-white text-center">Inventory no data</p>
                        }
                        {
                            itemResult.length > 0 && 
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th>Inventory Tag</th>
                                        <th>Item Name</th>
                                        <th>Property Number</th>
                                        <th>Stock</th>
                                        <th>Released</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        itemResult.map((item,index)=>{
                                            return (
                                                <tr key={index} className="border-b border-slate-900">
                                                    <td className="p-2">{item?.inventory_tag}</td>
                                                    <td className="p-2">{item?.item?.item_name}</td>
                                                    <td className="p-2">{item?.item?.property_number}</td>
                                                    <td className="p-2">{item?.stock}</td>
                                                    <td className="p-2">{item?.released}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}