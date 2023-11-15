'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Create () {

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

    const submitOffice = async () => {
        try {
            await axios.post('/api/department/create', officeForm)
            .then(res=>{
                setOfficeForm({
                    department_name: '',
                    office_name: ''
                })
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute top-20 md:top-0 right-0 w-full h-full md:w-4/5 p-6 flex justify-center items-center">
                <div className="w-full md:w-3/5 bg-white rounded-lg p-6">
                    <div className="w-full p-6">
                        <p className="text-2xl text-center font-bold">Create New Office</p>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Department</label>
                        <input 
                            type="text"
                            className="w-full p-2 border hover:border-black rounded-lg"
                            name="department_name"
                            onChange={handleOfficeChange}
                            value={officeForm.department_name}
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Office</label>
                        <input 
                            type="text"
                            className="w-full p-2 border hover:border-black rounded-lg"
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
                            onClick={submitOffice}
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