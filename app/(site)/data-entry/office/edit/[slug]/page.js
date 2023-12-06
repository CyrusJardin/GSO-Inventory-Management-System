'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

export default function Edit ({ params }) {

    const [officeForm, setOfficeForm] = useState({
        department_name: '',
        office_name: ''
    })

    const handleOfficeChange = e => {
        const {name, value} = e.target
        setOfficeForm({
            ...officeForm,
            [name]: value
        })
    }

    const updateOffice = async () => {
        try {
            await axios.post('/api/department/update', {
                department_name: officeForm.department_name,
                office_name: officeForm.office_name,
                _id: params.slug
            })
            .then(res=>{
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getDepartmentData = async () => {
            try {
                await axios.post('/api/department/show', {_id: params.slug})
                .then(res=>{
                    console.log(res.data.data)
                    setOfficeForm(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getDepartmentData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute top-20 md:top-0 right-0 w-full h-full md:w-4/5 p-6 flex justify-center items-center">
                <div className="w-full md:w-3/5 bg-indigo-900/10 text-white border border-white rounded-lg p-6">
                    <div className="w-full p-6">
                        <p className="text-2xl text-center font-bold">Edit New Office</p>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Department</label>
                        <input 
                            type="text"
                            className="w-full p-2 border hover:border-indigo-400 rounded-lg bg-indigo-900/10"
                            name="department_name"
                            onChange={handleOfficeChange}
                            value={officeForm.department_name}
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Office</label>
                        <input 
                            type="text"
                            className="w-full p-2 border hover:border-indigo-400 bg-indigo-900/10 rounded-lg"
                            name="office_name"
                            onChange={handleOfficeChange}
                            value={officeForm.office_name}
                        />
                    </div>
                    <div className="w-full py-6 flex gap-2">
                        <Link
                            href={'/data-entry/office'}
                            className="block text-center w-full md:w-1/2 p-2 rounded-lg bg-slate-800 hover:bg-slate-800/80 text-white"
                        >
                            back
                        </Link>
                        <button
                            onClick={updateOffice}
                            className="w-full md:w-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}