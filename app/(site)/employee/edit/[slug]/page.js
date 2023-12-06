'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import EditReleaseEmployee from "@/app/components/select/editReleaseEmployee";
import Swal from "sweetalert2";

export default function Edit ({ params }) {

    const router = useRouter()
    const [itemStocks, setItemStocks] = useState(null)
    const [selectedItem, setSelectedItem] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [defaultEmployee, setDefaultEmployee] = useState({
        value: '',
        label: ''
    })
    const [defaultItem, setDefaultItem] = useState({
        value: '',
        label: ''
    })
    const [data, setData] = useState({
        items: [],
        employees: []
    })

    const [employee, setEmployee] = useState({
        release_date: 0,
        quantity: '',
        remarks: '',
    })

    const handleEmployeeForm = e => {
        const {name, value} = e.target
        setEmployee({
            ...employee,
            [name]: value
        })
    }

    const onEmployeeChange = (e) => {
        setSelectedEmployee(e.value)
    }

    const onItemChange = e => {
        const val = e.value
        const stock = e.stocks
        setSelectedItem(val)
        setItemStocks(stock)
    }

    const onQuantityChange = e => {
        const newQty = parseInt(e.target.value)
        const qty = parseInt(employee.quantity, 10) - newQty
        const stc = parseInt(itemStocks) + qty
        setEmployee({
            ...employee,
            quantity: newQty
        })
        setItemStocks(stc)
    }

    function setOptions(items, employees) {
        let itemArr = []
        let ampArr = []
        console.log(items)
        items.forEach(element => {
            const itemObj = {
                value: element?._id,
                label: element?.item?.item_name,
                stocks: element?.stock
            }
            itemArr.push(itemObj)
        });
        employees.forEach(element => {
            const empObj = {
                value: element?._id,
                label: element?.first_name+' '+element?.last_name
            }
            ampArr.push(empObj)
        })
        setData({
            items: itemArr,
            employees: ampArr
        })
    }

    const updateEmployee = async (e) => {
        try {
            e.preventDefault()
            await axios.post('/api/release/update', {
                id: params.slug,
                item_id: selectedItem, 
                employee: selectedEmployee, 
                release_date: employee.release_date, 
                quantity: employee.quantity, 
                remarks: employee.remarks,
                stock: itemStocks
            })
            .then(res=>{
                Swal.fire(res.data.message)
                router.push('/employee')
            })
            .catch(err=>{
                Swal.fire(err.response.data.message)
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getData = async () => {
            try {
                await axios.post('/api/release/edit', {id: params.slug})
                .then(res=>{
                    console.log(res)
                    setOptions(res.data.item, res.data.employee)
                    setSelectedItem(res.data.data.inventory._id)
                    setSelectedEmployee(res.data.data.employee._id)
                    setDefaultItem({
                        value: res.data.data.inventory._id,
                        label: res.data.data.item.item_name
                    })
                    setDefaultEmployee({
                        value: res.data.data.employee._id,
                        label: res.data.data.employee.first_name + ' ' + res.data.data.employee.last_name
                    })
                    setEmployee(res.data.data)
                    setItemStocks(res.data.data.inventory.stock)
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
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 flex justify-center items-center">
                <div className="w-full md:w-3/5 p-6 bg-indigo-900/10 border border-white rounded-lg shadow-md">
                    <form onSubmit={updateEmployee} className="w-full">
                        <p className="text-2xl text-center text-white font-bold">Edit Release Item</p>
                        <div className="w-full">
                            <label className="text-xs text-white font-bold">Employee</label>
                            <EditReleaseEmployee options={data.employees} defaultItem={defaultEmployee} setItem={onEmployeeChange} />
                        </div>
                        <div className="w-full">
                            <label className="text-xs text-white font-bold">Item</label>
                            <EditReleaseEmployee options={data.items} defaultItem={defaultItem} setItem={onItemChange} />
                        </div>
                        <div className="flex gap-2 text-white">
                            <div className="w-1/2">
                                <label className="text-xs font-bold">Release Date</label>
                                <input 
                                    type="date"
                                    name="release_date"
                                    className="w-full p-2 rounded-lg border hover:border-indigo-900 bg-indigo-900/10"
                                    onChange={handleEmployeeForm}
                                    value={new Date(employee.release_date).toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="w-1/4">
                                <label className={`text-xs font-bold ${itemStocks < 0? 'text-red-600' : 'text-indigo-600'}`}>Stocks</label>
                                <input 
                                    type="text"
                                    className={`w-full p-2 rounded-lg border  ${itemStocks < 0 ? 
                                        'hover:border-red-600 bg-red-900 text-red-600' : 
                                        'hover:border-indigo-900 bg-indigo-600 text-white'}`}
                                    defaultValue={itemStocks}
                                    readOnly
                                />
                            </div>
                            <div className="w-1/4">
                                <label className={`text-xs font-bold ${itemStocks < 0 || employee.quantity <= 0 ? 'text-red-600' : ''}`}>Quantity</label>
                                <input 
                                    type="number"
                                    name="quantity"
                                    className={`w-full p-2 rounded-lg bg-indigo-900/10 border ${itemStocks < 0 || employee.quantity <= 0 ? 'border-red-600 text-red-600' : 'hover:border-indigo-900'}`}
                                    onChange={onQuantityChange}
                                    value={employee.quantity}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full text-white">
                            <label className="text-xs font-bold">Remarks</label>
                            <textarea 
                                type="text"
                                name="remarks"
                                className="w-full p-2 rounded-lg border hover:border-indigo-900 resize-none bg-indigo-900/10"
                                onChange={handleEmployeeForm}
                                value={employee.remarks}
                                placeholder="Type here..."
                            />
                        </div>
                        <div className="w-full py-6 flex gap-2">
                            <Link
                                href={'/inventory'}
                                className="block p-2 w-full md:w-1/2 rounded-lg bg-slate-800 hover:bg-slate-800/80 text-center text-white"
                            >
                                back
                            </Link>
                            <button
                                type="submit"
                                disabled={itemStocks < 0 || employee.quantity <= 0}
                                className="w-full md:w-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                            >
                                save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}