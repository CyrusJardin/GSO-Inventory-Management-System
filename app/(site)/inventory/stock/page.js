'use client';

import EmployeeSelect from "@/app/components/employeeSelect";
import ItemSelect from "@/app/components/itemSelect";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

export default function Stock () {

    const [items, setItems] = useState([])
    const [disableBtn, setDisableBtn] = useState(false)
    const [itemSelectOption, setItemSelectOption] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [sourceFund, setSourceFund] = useState('')
    const [tag, setTag] = useState('')
    const [qty, setQty] = useState(0)
    const [unitCost, setUnitCost] = useState(0.00)
    const [totalCost, setTotalCost] = useState(0.00)
    const [remark, setRemark] = useState('')
    const [dateAcquired, setDateAcquired] = useState('')

    const addStock = async () => {
        try {
            setDisableBtn(true)
            await axios.post('/api/inventory/store', {
                inventory_tag: tag,
                quantity: qty,
                unit_cost: unitCost,
                total_cost: totalCost,
                item_id: selectedItem?.value,
                date_acquired: dateAcquired,
                source_fund: sourceFund,
                remarks: remark
            })
            .then(res=>{
                setDisableBtn(false)
                setTag('')
                setQty(0)
                setUnitCost(0.00)
                setTotalCost(0.00)
                setDateAcquired('')
                setSourceFund('')
                setRemark('')
                setSelectedItem(null)
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                setDisableBtn(false)
                console.log(err)
            })
        } catch (error) {
            setDisableBtn(false)
            console.log(error)
        }
    }

    useEffect(()=>{
        const getDatas = async () => {
            try {
                await axios.get('/api/inventory')
                .then(res=>{
                    setItemOption(res.data.items)
                })
                .catch(err=>{
                    console.log(err.message)
                })
            } catch (error) {
                console.log(error.message)
            }
        }
        function setItemOption(items) {
            let arr = []
            items.forEach(element => {
                const optionObj = {
                    value: element?._id,
                    label: element?.item_name
                }
                arr.push(optionObj)
            });
            setItemSelectOption(arr)
        }
        getDatas()
        setTotalCost(qty * unitCost)
    }, [items, unitCost, qty])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white rounded-lg p-6 shadow-md space-y-2">
                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Inventory Tag</label>
                            <input 
                                type="text"
                                className={`w-full p-2 border  rounded-lg ${tag ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                                onChange={(e)=>setTag(e.target.value)}
                                value={tag}
                                required
                            />
                        </div>
                        <div className="md:w-1/2">
                            <label className="text-xs font-bold">Source of Funds</label>
                            <input 
                                type="text"
                                className={`w-full p-2 border  rounded-lg ${sourceFund ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                                onChange={(e)=>setSourceFund(e.target.value)}
                                value={sourceFund}
                                required
                            />
                        </div>
                    </div>    

                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Item</label>
                            {/* <ItemSelect className={`w-full p-2 border hover:border-black rounded-lg`} items={items} onItemChange={setSelectedItem} required/> */}
                            <Select 
                                options={itemSelectOption}
                                onChange={setSelectedItem}
                                
                                className={`w-full p-2 border  rounded-lg ${selectedItem ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Date Added</label>
                            <input 
                                className={`w-full p-2 border  rounded-lg ${dateAcquired ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                                type="date"
                                onChange={e=>setDateAcquired(e.target.value)}
                                value={dateAcquired}
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 md:flex gap-2">
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Quantity</label>
                                <input 
                                    type="Number"
                                    className={`w-full p-2 border  rounded-lg ${qty ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                                    onChange={(e)=>setQty(e.target.value)}
                                    value={qty}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Unit Cost</label>
                                <input 
                                    type="Number"
                                    className={`w-full p-2 border  rounded-lg ${unitCost ? 'hover:border-black' : 'border-red-300 hover:border-red-600'}`}
                                    onChange={(e)=>setUnitCost(e.target.value)}
                                    value={Number(unitCost).toFixed(2)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Total Cost</label>
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-indigo-400 rounded-lg"
                                    value={Number(totalCost).toFixed(2)}
                                    readOnly
                                />
                            </div>
                        </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Remarks</label>
                        <textarea 
                            className="resize-none p-2 w-full rounded-lg border hover:border-black"
                            placeholder="Type here..."
                            onChange={(e)=>setRemark(e.target.value)}
                            value={remark}
                        />
                    </div>
                </div>
                <div className="w-full bg-white rounded-lg p-6 shadow-md flex gap-2">
                    <Link
                        href={'/inventory'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-slate-800 hover:bg-slate-800/80 text-center text-white"
                    >
                        back
                    </Link>
                    <button
                        disabled={disableBtn}
                        className="w-full md:w-1/3 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                        onClick={addStock}
                    >
                        add stock
                    </button>
                </div>
            </div>
        </div>
    )
}