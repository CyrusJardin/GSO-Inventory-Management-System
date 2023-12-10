'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import DepartmentSelect from "@/app/components/select/departmentSelect";
import SelectMonth from "@/app/components/select/selectMonth";
import SelectYear from "@/app/components/select/selectYear";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import DateFrame from "@/app/components/dateFrame";
import Exports from "@/app/hooks/exports";
import { ImSpinner10 } from "react-icons/im";
import Link from "next/link";

export default function Department () {

    const [department, setDepartment] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState(new Date().getFullYear())
    const [total, setTotal] = useState(null)
    const [tableData, setTableData] = useState([])
    const {exportDepartment} = Exports()
    const [isLoading, setIsLoading] = useState(false)

    const confirmDelete = id => {
        Swal.fire({
            title: 'Confirm delete',
            text: 'Are you sure you want to delete this release?',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                archiveRelease(id)
            }
        })
    }

    const handleDepartment = e => {
        setDepartment(e.target.value)
        updateData(month, year, e.target.value)
    }

    const handleMonth = e => {
        setMonth(e.target.value)
        updateData(e.target.value, year, department)
    }

    const handleYear = e => {
        setYear(e.target.value)
        updateData(month, e.target.value, department)
    }

    const updateData = async (mon, yr, dep) => {
        try {
            setIsLoading(true)
            await axios.post('/api/department', {month: mon, year: yr, department: dep})
            .then(res=>{
                console.log(res)
                setTableData(res.data.data)
                setTotalCost(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                setTableData([])
                Swal.fire(err.response.data.message)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const archiveRelease = async (id) => {
        try {
            await axios.post('/api/release/archive', {id:id})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const setTotalCost = (data) => {
        let totalCost = 0;

        data.forEach(item => {
            var itemCost = item?.quantity * item?.inventory?.unit_cost;
            totalCost += itemCost;
        });

        setTotal(totalCost)
    }

    const getData = async () => {
        try {
            setIsLoading(true)
            await axios.post('/api/department', {month: month, year: year, department: department})
            .then(res=>{
                console.log(res)
                setTableData(res.data.data)
                setTotalCost(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                setTableData([])
                Swal.fire(err.response.data.message)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error.message)
            setTableData([])
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    const exportFile = () => {
        if (department == '' || department == null) {
            Swal.fire({
                title: 'Please select department',
                icon: 'warning',
            })
        }
        else if (month == '' || month == null) {
            Swal.fire({
                title: 'Please select month',
                icon: 'warning',
            })
        }
        else if (tableData.length <= 0) {
            Swal.fire({
                title: 'No data',
                icon: 'warning',
            })
        }
        else {
            exportDepartment(tableData, department, total, year, month)
        }
    }

    const confirmReturn = id => {
        Swal.fire({
            title: 'Return',
            icon: 'info',
            input: 'number',
            text: 'Enter the quantity to be returned',
            inputValidator: value=>{
                if (!value) {
                    return 'Quantity is required'
                }
                if (value <= 0) {
                    return 'Quantity is insufficient'
                }
            },
            showCancelButton: true
        })
        .then(res=>{
            if (res.value) {
                console.log(res.value)
                returnItem(id, res.value)
            }
        })
    }

    const returnItem = async (id, quantity) => {
        try {
            await axios.post('/api/release/return', {id: id, quantity: quantity})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const confirmCondemned = id => {
        Swal.fire({
            title: 'Condemned',
            icon: 'warning',
            text: 'Are you sure you want to report Condemned Item?',
            input: 'number',
            inputValidator: value=>{
                if (!value) {
                    return 'Quantity is required'
                }
            },
            showCancelButton: true,
            showConfirmButton: true,
        })
        .then(res=>{
            if (res.value) {
                condemnItem(id, res.value)
            }
        })
    }

    const condemnItem = async (id, qty) => {
        try {
            await axios.post('/api/release/condemn', {id: id, quantity: qty})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
                Swal.fire(err.response.data.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 pb-5 space-y-2">
                <div className="bg-indigo-900/10 border border-white rounded-lg shadow-md w-full p-6 flex gap-2">
                    <button
                        onClick={exportFile}
                        className="w-full md:w-1/3 bg-teal-600 hover:bg-teal-600/80 text-white rounded-lg p-2"
                    >
                        export
                    </button>
                </div>
                <div className="w-full bg-indigo-900/10 border border-white text-white rounded-lg shadow-md p-6">
                    <p className="text-2xl text-center font-bold font-serif">REPORT ON THE PHYSICAL COUNT OF INVENTORIES</p>                    
                    <p className="text-center">( PER DEPARTMENT )</p>
                    
                    <div className="w-full flex justify-center p-6">
                        <DepartmentSelect 
                            className="w-full md:w-1/5 placeholder:text-center border-b border-white bg-indigo-900/10 px-2"
                            onHandleChange={handleDepartment}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <SelectMonth className={'text-center text-xs border-b border-white bg-indigo-900/10'} onHandleChange={handleMonth} />
                            <SelectYear className={'text-center text-xs border-b border-white bg-indigo-900/10'} onSetChange={handleYear} />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="text-center text-xs border-b border-white bg-indigo-900/10"
                                defaultValue={Number(total).toLocaleString('en-US')}
                                readOnly
                            />
                            <p className="text-center text-xs">TOTAL</p>
                        </div>
                    </div>
                    <div className="p-6 overflow-scroll h-80 lg:h-96 relative">
                        <table className="table-auto w-full border border-slate-900">
                            <thead className="bg-slate-800 text-gray-400">
                                <tr>
                                    <th>Office</th>
                                    <th>Quantity</th>
                                    <th>Item</th>
                                    <th>Property No.</th>
                                    <th>ICS / ARE</th>
                                    <th>Name of EMPLOYEE</th>
                                    <th>Date Issued</th>
                                    <th>Cost</th>
                                    <th>Returned</th>
                                    <th>Remarks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ?
                                    <tr>
                                        <td colSpan={11} className="absolute w-full h-full flex justify-center items-center">
                                            <ImSpinner10 className="w-5 h-5 animate-spin" />
                                        </td>
                                    </tr>
                                    :
                                    (
                                        tableData.length > 0 ?
                                        tableData.map((item,id)=>{
                                            return(
                                                <tr key={id}>
                                                    <td className=" border p-2 border-slate-900">{item.department?.department_name}</td>
                                                    <td className=" border p-2 border-slate-900">{item.quantity}</td>
                                                    <td className=" border p-2 border-slate-900">{item.item.item_name}</td>
                                                    <td className=" border p-2 border-slate-900">{item.item.property_number}</td>
                                                    <td className=" border p-2 border-slate-900">{item.inventory?.ics_are?.toUpperCase()}</td>
                                                    <td className=" border p-2 border-slate-900">{item.employee?.first_name} {item.employee?.last_name}</td>
                                                    <td className=" border p-2 border-slate-900">
                                                        <DateFrame dateStr={item.release_date} />
                                                    </td>
                                                    <td className=" border p-2 border-slate-900">{item.inventory.unit_cost * item.quantity}</td>
                                                    <td className=" border p-2 border-slate-900">{item.returned}</td>
                                                    <td className=" border p-2 border-slate-900">{item.remarks}</td>
                                                    <td className="space-y-2 p-2 border border-slate-900 text-white">
                                                        <Link
                                                            href={'/employee/edit/'+item?._id}
                                                            className="block text-center w-full p-2 rounded-lg hover:font-bold bg-green-600 hover:bg-green-600/80"
                                                        >
                                                            edit
                                                        </Link>
                                                        <button
                                                            onClick={()=>confirmDelete(item._id)}
                                                            className="w-full p-2 rounded-lg hover:font-bold bg-red-600 hover:bg-red-600/80"
                                                        >
                                                            delete
                                                        </button>
                                                        <button
                                                            onClick={()=>confirmReturn(item._id)}
                                                            className="w-full p-2 rounded-lg hover:font-bold bg-teal-600 hover:bg-teal-600/80"
                                                        >
                                                            return
                                                        </button>
                                                        
                                                        <button
                                                            onClick={()=>confirmCondemned(item._id)}
                                                            className="w-full p-2 rounded-lg hover:font-bold bg-indigo-600 hover:bg-indigo-600/80"
                                                        >
                                                            condemned
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={11} className="text-center">No data</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}