'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Select from "react-select";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Edit ({ params }) {

    const [editForm, setEditForm] = useState({
        id: params.slug,
        inventory_tag: '',
        source_fund: '',
        date_acquired: new Date(),
        item_id: '',
        quantity: 0,
        unit_cost: 0,
        total_cost: 0,
        stock: 0,
        remarks: ''
    })
    const [itemSelectOption, setItemSelectOption] = useState([])
    const [defaultItem, setDefaultItem] = useState({})
    const [defaultStock, setDefaultStock] = useState(0)
    const [defaultQty, setDefaultQty] = useState(0)

    const onEditChange = e => {
        const {name, value} = e.target
        setEditForm({
            ...editForm,
            [name]: value
        })
    }

    const onItemChange = e => {
        setEditForm({
            ...editForm,
            item_id: e.value
        })
    }

    const processInventoryData = inventory => {
        setEditForm({
            id: params.slug,
            inventory_tag: inventory.inventory_tag,
            source_fund: inventory.source_fund,
            date_acquired: inventory.date_acquired,
            item_id: inventory.item._id,
            quantity: inventory.quantity,
            unit_cost: inventory.unit_cost,
            total_cost: inventory.total_cost,
            stock: inventory.stock,
            remarks: inventory.remarks
        })
        setDefaultItem({value:inventory.item._id, label: inventory.item.item_name})
        setDefaultStock(inventory.stock)
        setDefaultQty(inventory.quantity)
    }

    const onQuantityChange = e => {
        const newQuantity  = parseInt(e.target.value, 10)
        // const proportionalValue = Math.min(newValue, (editForm.quantity - editForm.stock))

        if (!isNaN(newQuantity ) && newQuantity  >= 0) {
            const stockChange = newQuantity  - defaultQty
            const newStock = defaultStock + stockChange
            const newTotalCost = newStock * editForm.unit_cost
            setEditForm({
                ...editForm,
                quantity: newQuantity,
                stock: newStock,
                total_cost: newTotalCost
            })
        }
    }

    const submitUpdate = async () => {
        try {
            await axios.post('/api/inventory/update', editForm)
            .then(res=>{
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getData = async () => {
            try {
                await axios.post('/api/inventory/edit', {id: params.slug})
                .then(res=>{
                    setItemOption(res.data.item)
                    processInventoryData(res.data.data)
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
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
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white rounded-lg shadow-md p-6 space-y-2">
                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Inventory Tag</label>
                            <input 
                                type="text"
                                className="w-full p-2 border hover:border-black rounded-lg"
                                name="inventory_tag"
                                onChange={onEditChange}
                                value={editForm.inventory_tag}
                                required
                            />
                        </div>
                        <div className="md:w-1/2">
                            <label className="text-xs font-bold">Source of Funds</label>
                            <input 
                                type="text"
                                className="w-full p-2 border hover:border-black rounded-lg"
                                name="source_fund"
                                onChange={onEditChange}
                                value={editForm.source_fund}
                                required
                            />
                        </div>
                    </div>  
                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Item</label>
                            <Select 
                                options={itemSelectOption}
                                onChange={onItemChange}
                                value={defaultItem}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold">Date Added</label>
                            <input 
                                className="w-full p-2 border hover:border-black rounded-lg"
                                type="date"
                                name="date_acquired"
                                onChange={onEditChange}
                                value={new Date(editForm.date_acquired).toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full md:flex gap-2">
                        <div className="w-full md:w-1/4">
                            <label className="text-xs font-bold">Quantity</label>
                            <input 
                                type="Number"
                                className="w-full p-2 border hover:border-black rounded-lg"
                                onChange={onQuantityChange}
                                value={editForm.quantity}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="text-xs font-bold">Unit Cost</label>
                            <input 
                                type="Number"
                                className="w-full md:w-full p-2 border hover:border-black rounded-lg"
                                value={editForm.unit_cost.toFixed(2)}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className={`text-xs font-bold ${editForm.total_cost > 0 ? 'text-green-600' : 'text-red-600'}`}>Total Cost</label>
                            <input 
                                type="text"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${editForm.total_cost > 0 ? 'text-green-600 border-green-200 hover:border-green-600 focus:ring-green-600' : 
                                    'text-red-600 border-red-200 hover:border-red-600 focus:ring-red-600'}`}
                                value={editForm.total_cost.toFixed(2)}
                                readOnly
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className={`text-xs font-bold text-indigo-600 ${editForm.stock < 0 ? 'text-red-600' : ''}`}>Stock</label>
                            <input 
                                type="text"
                                className={`w-full p-2 border focus:outline-none focus:ring-2 rounded-lg ${editForm.stock < 0 ? 'border-red-200 text-red-600 focus:ring-red-600 hover:border-red-600 border-red-200' : 'border-indigo-200 focus:ring-indigo-600 hover:border-indigo-600 text-indigo-600 border-indigo-200'}`}
                                value={editForm.stock}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Remarks</label>
                        <textarea 
                            className="resize-none p-2 w-full rounded-lg border hover:border-black"
                            placeholder="Type here..."
                            name="remarks"
                            onChange={onEditChange}
                            value={editForm.remarks}
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
                        className="w-full md:w-1/3 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                        onClick={submitUpdate}
                    >
                        update
                    </button>
                </div>
            </div>
        </div>
    )
}