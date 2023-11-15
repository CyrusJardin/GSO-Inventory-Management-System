'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Scan () {

    const [searchItemResult, setSearchItemResult] = useState({
        description: ['']
    })
    const [searchStockResult, setSearchStockResult] = useState([])
    const [searchReleaseResult, setSearchReleaseResult] = useState([])

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });
      
        scanner.render(success, error);
      
        function success(result) 
        {
            searchForItem(result);
        }
      
        function error(err)
        {
            console.log(err);
        }

        const searchForItem = async (code) => {
            try {
                await axios.post('/api/scan', {barcode_text: code})
                .then(res=>{
                    setSearchItemResult(res.data.item)
                    setSearchStockResult(res.data.stock)
                    setSearchReleaseResult(res.data.releases)
                })
                .catch(err=>{
                    console.log(err.message)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white rounded-lg p-6 shadow-md md:flex gap-2">
                    <div className="w-full md:w-1/2 border border-slate-900 rounded-lg">
                        <div id="reader" className="w-full h-full"></div>
                    </div>
                    <div className="w-full h-64 md:h-96 p-6 overflow-y-scroll md:w-1/2 border border-slate-900 rounded-lg">
                        <p><span className="font-bold">Item Name: </span>{searchItemResult?.item_name}</p>
                        <p><span className="font-bold">Property Number:</span> {searchItemResult?.property_number}</p>
                        <p><span className="font-bold">Barcode:</span> {searchItemResult?.barcode_text}</p>
                        <p><span className="font-bold">Unit:</span> {searchItemResult?.unit}</p>
                        <p className="font-bold">Description:</p>
                        {
                            searchItemResult?.description.map((item,id)=>{
                                return(<p className="border-b border-slate-800" key={id}>-{item}</p>)
                            })
                        }
                    </div>
                </div>
                <div className="w-full bg-white rounded-lg p-6 shadow-md">
                    <div className="w-full h-96 overflow-scroll">
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border border-gray-800">Inventory Tag</th>
                                    <th className="border border-gray-800">Stock</th>
                                    <th className="border border-gray-800">Source of Funds</th>
                                    <th className="border border-gray-800">Unit Cost</th>
                                    <th className="border border-gray-800">Total Cost</th>
                                    <th className="border border-gray-800">Released</th>
                                    <th className="border border-gray-800">Date Released</th>
                                    <th className="border border-gray-800">Condemned</th>
                                    <th className="border border-gray-800">Employee Name</th>
                                    <th className="border border-gray-800">Returned</th>
                                    <th className="border border-gray-800">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-gray-800 text-white border border-gray-800">
                                    <th>Release</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {
                                    searchReleaseResult.length > 0 ?
                                    searchReleaseResult.map((item,id)=>{
                                        return (
                                            <tr key={id}>
                                                <td className="border border-gray-800">{item?.inventory?.inventory_tag}</td>
                                                <td className="border border-gray-800">{item?.inventory?.stock}</td>
                                                <td className="border border-gray-800">{item?.inventory?.source_fund}</td>
                                                <td className="border border-gray-800">{item?.inventory?.unit_cost}</td>
                                                <td className="border border-gray-800">{item?.inventory?.total_cost}</td>
                                                <td className="border border-gray-800">{item?.released}</td>
                                                <td className="border border-gray-800">{item?.release_date}</td>
                                                <td className="border border-gray-800">{item?.inventory?.condemned}</td>
                                                <td className="border border-gray-800">{item?.employee?.first_name} {item?.employee?.last_name}</td>
                                                <td className="border border-gray-800">{item?.returned}</td>
                                                <td className="border border-gray-800">{item?.remarks}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className="border border-gray-800">
                                        <td colSpan={11} className="text-center">no data</td>
                                    </tr>
                                }
                                <tr className="bg-gray-800 text-white border border-gray-800">
                                    <th>Stocks</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {
                                    searchStockResult.length > 0 ?
                                    searchStockResult.map((item,index)=>{
                                        return (
                                            <tr key={index}>
                                                <td className="border border-gray-800">{item?.inventory_tag}</td>
                                                <td className="border border-gray-800">{item?.stock}</td>
                                                <td className="border border-gray-800">{item?.source_fund}</td>
                                                <td className="border border-gray-800">{item?.unit_cost}</td>
                                                <td className="border border-gray-800">{item?.total_cost}</td>
                                                <td className="border border-gray-800">#</td>
                                                <td className="border border-gray-800">#</td>
                                                <td className="border border-gray-800">{item?.condemned}</td>
                                                <td className="border border-gray-800">#</td>
                                                <td className="border border-gray-800">#</td>
                                                <td className="border border-gray-800">{item?.remarks}</td>
                                            </tr>
                                        )
                                    }) :
                                    <tr className="border border-gray-800">
                                        <td colSpan={11} className="text-center">no data</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}