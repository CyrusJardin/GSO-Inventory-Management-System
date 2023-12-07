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
    const [selectedItem, setSelectedItem] = useState('')
    const [sourceFund, setSourceFund] = useState('')
    const [tag, setTag] = useState('')
    const [qty, setQty] = useState(0)
    const [unitCost, setUnitCost] = useState(0.00)
    const [totalCost, setTotalCost] = useState(0.00)
    const [remark, setRemark] = useState('')
    const [dateAcquired, setDateAcquired] = useState('')
    const [stockForm, setStockForm] = useState({
        inventory_tag: '',
        quantity: 0,
        unit_cost: 0,
        total_cost: 0,
        item_id: '',
        date_acquired: new Date(),
        source_fund: '',
        remarks: ''
    })

    const handleStock = e => {
        const {name, value} = e.target
        setStockForm({
            ...stockForm,
            [name]: value
        })
    }

    const addStock = async () => {
        try {
            setDisableBtn(true)
            await axios.post('/api/inventory/store', stockForm
            // {
            //     inventory_tag: tag,
            //     quantity: qty,
            //     unit_cost: unitCost,
            //     total_cost: totalCost,
            //     item_id: selectedItem,
            //     date_acquired: dateAcquired,
            //     source_fund: sourceFund,
            //     remarks: remark
            // }
            )
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
                Swal.fire(err.response.data.message)
                console.log(err)
            })
        } catch (error) {
            setDisableBtn(false)
            console.log(error)
        }
    }

    
    const getDatas = async () => {
        try {
            await axios.get('/api/inventory')
            .then(res=>{
                // setItemOption(res.data.items)
                console.log(res)
                setItemSelectOption(res.data.items)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    // function setItemOption(items) {
    //     let arr = []
    //     items.forEach(element => {
    //         const optionObj = {
    //             value: element?._id,
    //             label: element?.item_name
    //         }
    //         arr.push(optionObj)
    //     });
    //     setItemSelectOption(arr)
    // }

    useEffect(()=>{
        getDatas()
        // setTotalCost(qty * unitCost)
    })

    // const customStyles = {
    //     control: (provided, state) => ({
    //         ...provided,
    //         borderColor: state.isFocused ? 'border-indigo-900' : 'border-indigo-400',
    //         boxShadow: state.isFocused ? '0 0 0 1px #3498db' : 'none',
    //         '&:hover': {
    //             borderColor: 'border-gray-400',
    //         },
    //         backgroundColor: 'bg-indigo-900/10',
    //     }),
    //     menu: (baseStyle)=>({
    //         ...baseStyle,
    //         colors: 'black',
    //         backgroundColor: 'white',
    //     }),
    //   };

    const handleQuantity = e => {
        const q = e.target.value
        const newTotal = q * unitCost
        setQty(q)
        setTotalCost(newTotal)
        setStockForm({
            ...stockForm,
            quantity: q,
            total_cost: newTotal
        })
    }

    const handleUnitCost = e => {
        const cost = e.target.value
        const newTotal = qty * cost
        setUnitCost(cost)
        setTotalCost(newTotal)
        setStockForm({
            ...stockForm,
            unit_cost: cost,
            total_cost: newTotal
        })
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-indigo-900/10 border border-white text-white rounded-lg p-6 shadow-md space-y-2">
                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Inventory Tag</label>
                            <input 
                                type="text"
                                name="inventory_tag"
                                className={`w-full p-2 border bg-indigo-900/10 rounded-lg ${tag ? 'hover:border-indigo-900' : 'border-red-300 hover:border-red-600'}`}
                                // onChange={(e)=>setTag(e.target.value)}
                                onChange={handleStock}
                                value={stockForm.inventory_tag}
                                required
                            />
                        </div>
                        <div className="md:w-1/2">
                            <label className="text-xs font-bold">Source of Funds</label>
                            <input 
                                type="text"
                                name="source_fund"
                                className={`w-full p-2 border bg-indigo-900/10 rounded-lg ${sourceFund ? 'hover:border-indigo-900' : 'border-red-300 hover:border-red-600'}`}
                                // onChange={(e)=>setSourceFund(e.target.value)}
                                // value={sourceFund}
                                onChange={handleStock}
                                value={stockForm.source_fund}
                                required
                            />
                        </div>
                    </div>    

                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold text-white">Item</label>
                            {/* <ItemSelect className={`w-full p-2 border hover:border-black rounded-lg`} items={items} onItemChange={setSelectedItem} required/> */}
                            {/* <Select 
                                options={itemSelectOption}
                                onChange={setSelectedItem}
                                styles={customStyles}
                                // classNames={{
                                //     menuList: (state)=>`bg-slate-900 ${state.isFocused && 'bg-blue-400'} ${state.isSelected && 'bg-blue-400'}`,
                                // }}
                            /> */}
                            <select
                                // onChange={e=>setSelectedItem(e.target.value)}
                                name="item_id"
                                onChange={handleStock}
                                value={stockForm.item_id}
                                className="p-2 bg-indigo-900/10 border border-white hover:border-indigo-400 w-full rounded-lg"
                            >
                                <option className="bg-slate-900 text-white">Select...</option>
                                {
                                    itemSelectOption.map((item,idx)=>{
                                        return (
                                            <option key={idx} value={item._id} className="bg-slate-900 text-white">{item.item_name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Date Added</label>
                            <input 
                                className={`w-full p-2 border bg-indigo-900/10 rounded-lg ${dateAcquired ? 'hover:border-indigo-900' : 'border-red-300 hover:border-red-600'}`}
                                type="date"
                                name="date_acquired"
                                // onChange={e=>setDateAcquired(e.target.value)}
                                // value={dateAcquired}
                                onChange={handleStock}
                                value={stockForm.date_acquired}
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 md:flex gap-2">
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Quantity</label>
                                <input 
                                    type="Number"
                                    className={`w-full p-2 border bg-indigo-900/10 rounded-lg ${qty ? 'hover:border-indigo-900' : 'border-red-300 hover:border-red-600'}`}
                                    onChange={handleQuantity}
                                    // value={qty}
                                    value={stockForm.quantity}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Unit Cost</label>
                                <input 
                                    type="Number"
                                    className={`w-full p-2 border bg-indigo-900/10 rounded-lg ${unitCost ? 'hover:border-indigo-900' : 'border-red-300 hover:border-red-600'}`}
                                    onChange={handleUnitCost}
                                    // value={Number(unitCost).toFixed(2)}
                                    value={Number(stockForm.unit_cost).toFixed(2)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="text-xs font-bold">Total Cost</label>
                                <input 
                                    type="text"
                                    className="w-full p-2 border border-indigo-400 rounded-lg bg-indigo-900/10"
                                    // value={Number(totalCost).toFixed(2)}
                                    value={Number(stockForm.total_cost).toFixed(2)}
                                    readOnly
                                />
                            </div>
                        </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Remarks</label>
                        <textarea 
                            className="resize-none p-2 w-full rounded-lg border border-white hover:border-indigo-900 bg-indigo-900/10"
                            placeholder="Type here..."
                            // onChange={(e)=>setRemark(e.target.value)}
                            // value={remark}
                            name="remarks"
                            onChange={handleStock}
                            value={stockForm.remarks}
                        />
                    </div>
                </div>
                <div className="w-full bg-indigo-900/10 border border-white rounded-lg p-6 shadow-md flex gap-2">
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