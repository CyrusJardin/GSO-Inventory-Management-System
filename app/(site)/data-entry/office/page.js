'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Department () {

    const [offices, setOffices] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getDepartment = async () => {
        try {
            setIsLoading(true)
            await axios.get('/api/department/data-entry')
            .then(res=>{
                console.log(res)
                setOffices(res.data.data)
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
        getDepartment()
    }, [])

    const deleteDepartment = async (id) => {
        try {
            await axios.post('/api/department/delete', {_id: id})
            .then(res=>{
                Swal.fire(res.data.message)
                getDepartment()
            })
            .catch(err=>{
                Swal.fire(err.message)
                getDepartment()
            })
        } catch (error) {
            console.log(error)
            getDepartment()
        }
    }

    return (
        <div>
            <TopNav />  
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full p-6 bg-indigo-900/10 border border-white rounded-lg shadow-md">
                    <Link
                        href={'/data-entry/office/create'}
                        className="block w-full md:w-1/3 p-2 rounded-lg bg-blue-600 text-center text-white hover:bg-blue-600/80"
                    >
                        new office
                    </Link>
                </div>
                <div className="w-full h-96 overflow-scroll p-6 bg-indigo-900/10 border border-white text-white rounded-lg shadow-md relative">
                    <table className="table-auto w-full border border-slate-900">
                        <thead className="bg-slate-800 text-gray-400">
                            <tr>
                                <th>Department</th>
                                <th>Office</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                isLoading ?
                                <tr>
                                    <td colSpan={3} className="absolute w-full h-full flex justify-center items-center">
                                        <ImSpinner10 className="w-5 h-5 animate-spin" />
                                    </td>
                                </tr>
                                :
                                offices.map((item,id)=>{
                                    return(
                                        <tr key={id} className="hover:bg-gray-900/50 hover:text-white">
                                            <td className="p-2 border border-slate-900">{item?.department_name}</td>
                                            <td className="p-2 border border-slate-900">{item?.office_name}</td>
                                            <td className="flex gap-2 p-2 border border-slate-900 text-white">
                                                <Link
                                                    href={'/data-entry/office/edit/'+item?._id}
                                                    className="block text-center w-1/2 p-1 bg-green-600 hover:bg-green-600/80"
                                                >
                                                    edit
                                                </Link>
                                                <button
                                                    onClick={()=>deleteDepartment(item?._id)}
                                                    className="w-1/2 p-1 bg-red-600 hover:bg-red-600/80"
                                                >
                                                    delete
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