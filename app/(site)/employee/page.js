'use client'

import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import EmployeeName from "@/app/components/select/employeeName";
import SelectMonth from "@/app/components/select/selectMonth";
import SelectYear from "@/app/components/select/selectYear";
import axios from "axios";
import Link from "next/link";
import Exports from "@/app/hooks/exports";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ImSpinner10 } from "react-icons/im";

export default function Employee () {

    const [employees, setEmployees] = useState([])
    const [month, setMonth] = useState('')
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [totalCost, setTotalCost] = useState(null)
    const [employeeDetails, setEmployeeDetails] = useState({
        department: '',
        status: '',
        position: '',
        name: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const {exportARE, exportICS, exportAllItem} = Exports()

    const handleMonth = e => {
        setMonth(e.target.value)
        updateEmployees(selectedEmployee, e.target.value , year)
    }

    const handleYear = e => {
        setYear(e.target.value)
        updateEmployees(selectedEmployee, month, e.target.value)
    }

    const archiveRelease = async (id) => {
        try {
            await axios.post('/api/release/archive', {id:id})
            .then(res=>{
                Swal.fire(res.data.message)
                getEmployees()
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const confirmDelete = id => {
        Swal.fire({
            title: 'Confirm delete',
            text: 'Are you sure you want to delete this released item?',
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

    const calculateTotalCost = (data) => {
        let totalCost = 0;

        data.forEach(item => {
            var itemCost = item?.quantity * item?.inventory?.unit_cost;
            totalCost += itemCost;
        });

        setTotalCost(totalCost)
    }

    const updateEmployees = async (id, mon, yr) => {
        try {
            setIsLoading(true)
            await axios.post('/api/employee/index', {id:id, month: mon, year: yr})
            .then(res=>{
                console.log(res)
                setEmployees(res.data.data)
                calculateTotalCost(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const getEmployees = async () => {
        try {
            setIsLoading(true)
            await axios.post('/api/employee/index', {id:selectedEmployee, month: month, year: year})
            .then(res=>{
                console.log(res)
                setEmployees(res.data.data)
                calculateTotalCost(res.data.data)
                setIsLoading(false)
            })
            .catch(err=>{
                console.log(err)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        getEmployees()
    }, [])

    const exportAll = () => {
        if (selectedEmployee == '' || selectedEmployee == null) {
            Swal.fire({
                title: 'Please select employee',
                icon: 'warning',
            })
        } 
        else if (month == '' || month == null) {
            Swal.fire({
                title: 'Please select month',
                icon: 'warning'
            })
        }
        else if (employees.length <= 0) {
            Swal.fire({
                title: 'No data',
                icon: 'warning'
            })
        }
        else {
            exportAllItem(employees, month, year, employeeDetails, totalCost)
        }
    }

    const exportIndividual = idx => {
        if (selectedEmployee == '' || selectedEmployee == null) {
            Swal.fire({
                title: 'Please select employee',
                icon: 'warning',
            })
        } 
        else if (employees.length <= 0) {
            Swal.fire({
                title: 'No data',
                icon: 'warning'
            })
        }
        else {
            const arr = employees[idx]
            Swal.fire({
                title: 'Enter your purpose for this document',
                icon: 'info',
                input: 'text',
                inputValidator: value=>{
                    if(!value) {
                        return 'Please enter your purpose'
                    }
                },
                showCancelButton: true,
            })
            .then(res=>{
                if (res.value && arr.inventory.ics_are.toLowerCase() == 'are') {
                    exportARE(arr, employeeDetails, res.value)
                }
                if (res.value && arr.inventory.ics_are.toLowerCase() == 'ics') {
                    exportICS(arr, employeeDetails, res.value)
                }
            })
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
            },
            showCancelButton: true
        })
        .then(res=>{
            if (res.value) {
                returnItem(id, res.value)
            }
        })
    }

    const returnItem = async (id, quantity) => {
        try {
            await axios.post('/api/release/return', {id: id, quantity: quantity})
            .then(res=>{
                getEmployees()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
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
                getEmployees()
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
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 pb-1 space-y-2">
                <div className="w-full bg-white p-6 rounded-lg shadow-md text-white flex gap-2">
                    <button
                        onClick={exportAll}
                        className="w-full md:w-1/3 rounded-lg p-2 bg-teal-600 hover:bg-teal-600/80 hover:font-bold"
                    >
                        export 
                    </button>
                </div>
                <div className="w-full bg-white p-6 rounded-lg shadow-md">
                    <p className="text-center text-2xl font-bold font-serif">INDIVIDUAL</p>
                    <p className="text-center">( AS OF <SelectMonth onHandleChange={handleMonth} /> <SelectYear onSetChange={handleYear} /> )</p>
                    <div className="md:flex w-full justify-center mt-6">
                        <div>
                            <EmployeeName className={'border-black border-b'} onChangeDetails={setEmployeeDetails} toActivate={updateEmployees} onChangeEmployee={setSelectedEmployee} month={month} year={year} />
                            <p className="text-center text-gray-800 text-sm">NAME OF EMPLOYEE</p>
                        </div>
                    </div>
                    <div className="md:flex justify-between p-6">
                        <div className="flex flex-col w-full md:w-1/5">
                            <input 
                                className="border-black w-full border-b"
                                placeholder="Department"
                                defaultValue={employeeDetails.department}
                                readOnly
                            />
                            <label className="text-center text-xs">Department</label>
                        </div>
                        <div className="flex flex-col w-full md:w-1/5">
                            <input 
                                className="border-black w-full border-b"
                                placeholder="Position"
                                defaultValue={employeeDetails.position}
                                readOnly
                            />
                            <label className="text-center text-xs">Position</label>
                        </div>
                        <div className="flex flex-col w-full md:w-1/5">
                            <input 
                                className="border-black w-full border-b"
                                placeholder="Status of Employment"
                                defaultValue={employeeDetails.status}
                                readOnly
                            />
                            <label className="text-center text-xs">Status of Employment</label>
                        </div>
                        <div className="flex flex-col w-full md:w-1/5">
                            <input 
                                className="border-black w-full border-b"
                                placeholder="Total Cost"
                                defaultValue={Number(totalCost).toLocaleString('en-US')}
                                readOnly
                            />
                            <label className="text-center text-xs">Total Cost</label>
                        </div>
                    </div>
                    <div className="w-full p-6 h-72 overflow-scroll relative">
                        {
                            isLoading ?
                            <div className="absolute w-full h-full flex justify-center items-center">
                                <ImSpinner10 className="w-5 h-5 animate-spin" />
                            </div>
                            :
                            <table className="table-auto w-full border border-slate-900">
                                <thead className="bg-slate-800 text-gray-600">
                                    <tr>
                                        <th>Quantity</th>
                                        <th>Item</th>
                                        <th>Description</th>
                                        <th>Property Number</th>
                                        <th>Date Issued</th>
                                        <th>Cost</th>
                                        <th>ICS / ARE</th>
                                        <th>Returned</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        employees.length > 0 ?
                                        employees.map((item,id)=>{
                                            return(
                                                <tr key={id}>
                                                    <td className="border border-slate-900">{item?.quantity}</td>
                                                    <td className="border border-slate-900">{item?.item?.item_name}</td>
                                                    <td className="border border-slate-900">{item?.item?.description?.map((desc,idx)=>{
                                                        return(
                                                            <p key={idx}>{desc}</p>
                                                        )
                                                    })}</td>
                                                    <td className="border border-slate-900">{item?.item?.property_number}</td>
                                                    <td className="border border-slate-900"><DateFrame dateStr={item?.release_date} /></td>
                                                    <td className="border border-slate-900">{(item?.inventory?.unit_cost * item?.quantity).toLocaleString('en-US')}</td>
                                                    <td className="border border-slate-900">{item?.inventory?.ics_are?.toUpperCase()}</td>
                                                    <td className="border border-slate-900">{item?.returned}</td>
                                                    <td className="border border-slate-900">{item?.remarks}</td>
                                                    <td className="border border-slate-900 space-y-1 p-1">
                                                        <Link
                                                            href={'/employee/edit/'+item._id}
                                                            className="block bg-green-600 hover:bg-green-600/80 p-2 rounded-lg text-center text-white"
                                                        >
                                                            edit
                                                        </Link>
                                                        <button
                                                            onClick={()=>confirmDelete(item._id)}
                                                            className="bg-red-600 hover:bg-red-600/80 p-2 w-full rounded-lg text-white"
                                                        >
                                                            archive
                                                        </button>
                                                        <button
                                                            onClick={()=>confirmReturn(item._id)}
                                                            className="bg-teal-600 hover:bg-teal-600/80 p-2 w-full rounded-lg text-white"
                                                        >
                                                            return
                                                        </button>
                                                        <button
                                                            onClick={()=>exportIndividual(id)}
                                                            className="bg-indigo-600 hover:bg-indigo-600/80 p-2 w-full rounded-lg text-white"
                                                        >
                                                            export
                                                        </button>
                                                        <button
                                                            onClick={()=>confirmCondemned(item._id)}
                                                            className="bg-purple-600 hover:bg-purple-600/80 p-2 w-full rounded-lg text-white"
                                                        >
                                                            condemned
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={10} className="text-center">No data</td>
                                        </tr>
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