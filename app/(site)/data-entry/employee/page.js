'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ImSpinner10 } from "react-icons/im";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function Employee () {

    const [employees, setEmployees] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const confirmDelete = (id, index) => {
        Swal.fire({
            title: 'Confirm Delete',
            icon: 'warning',
            text: `Are you sure you want to delete this employee: ${employees[index]['first_name']} ${employees[index]['last_name']}?`,
            showConfirmButton: true,
            showCancelButton: true,
        })
        .then(res=>{
            if(res.isConfirmed) {
                deleteEmployee(id)
            }
        })
    }

    const deleteEmployee = async (id) => {
        try {
            await axios.post('/api/employee/delete', {id: id})
            .then(res=>{
                getEmployees()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const getEmployees = async () => {
        try {
            setIsLoading(true)
            await axios.get('/api/employee')
            .then(res=>{
                setEmployees(res.data.data)
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
        getEmployees()
    },[])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-indigo-900/10 border border-white p-6 rounded-lg shadow-md">
                    <Link
                        href={'/data-entry/employee/create'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-blue-600 text-center text-white hover:bg-blue-600/80"
                    >
                        new employee
                    </Link>
                </div>
                <div className="w-full bg-indigo-900/10 border border-white text-white p-6 rounded-lg h-96 overflow-scroll shadow-md relative">
                    <table className="w-full table-auto border border-slate-900">
                        <thead className="bg-slate-800 text-gray-400">
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Office</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ?
                                <tr>
                                    <td colSpan={6} className="absolute w-full h-full flex justify-center items-center">
                                        <ImSpinner10 className="w-5 h-5 animate-spin" />
                                    </td>
                                </tr>
                                :
                                employees.map((item, id)=>{
                                    return(
                                        <tr key={id} className="hover:bg-gray-900/50 hover:text-white">
                                            <td className="p-2 border border-slate-900">{item?.first_name} {item?.last_name}</td>
                                            <td className="p-2 border border-slate-900">{item?.department?.department_name}</td>
                                            <td className="p-2 border border-slate-900">{item?.department?.office_name}</td>
                                            <td className="p-2 border border-slate-900">{item?.position}</td>
                                            <td className="p-2 border border-slate-900">{item?.employment_status}</td>
                                            <td className="space-y-2 p-2 border border-slate-900 text-white">
                                                <Link
                                                    href={'/data-entry/employee/edit/'+item?._id}
                                                    className="block rounded-lg text-center p-1 bg-green-600 hover:bg-green-600/80"
                                                >
                                                    <HiPencilSquare className="w-6 h-6" />
                                                </Link>
                                                <button
                                                    onClick={()=>confirmDelete(item?._id, id)}
                                                    className="rounded-lg p-1 bg-red-600 hover:bg-red-600/80"
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