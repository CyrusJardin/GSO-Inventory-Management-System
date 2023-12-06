'use client'

import { useEffect, useState } from "react"
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Edit ({ params }) {

    const [department, setDepartment] = useState([])
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        employment_status: '',
        department: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const updateEmployee = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/employee/update', {
                _id: params.slug,
                first_name: formData.first_name,
                last_name: formData.last_name,
                position: formData.position,
                employment_status: formData.employment_status,
                department: department
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
        const getData = async () => {
            try {
                await axios.post('/api/employee/show', {id: params.slug})
                .then(res=>{
                    console.log(res)
                    setFormData(res.data.data)
                    setDepartment(res.data.departments)
                })
                .catch(err=>{
                    console.log(err)
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
            <div className="absolute w-full md:w-4/5 top-20 h-full right-0 p-6 flex justify-center items-center">
                <form onSubmit={updateEmployee} className="w-full md:w-3/5 bg-indigo-900/10 border border-white text-white p-6 rounded-lg">
                    <div className="w-full p-6">
                        <p className="text-2xl text-center font-bold">Edit Employee</p>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">First Name</label>
                        <input 
                            type="text"
                            className="w-full p-1 rounded-lg border hover:border-indigo-400 bg-indigo-900/10"
                            name="first_name"
                            onChange={handleChange}
                            value={formData.first_name}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Last Name</label>
                        <input 
                            type="text"
                            className="w-full p-1 rounded-lg border hover:border-indigo-400 bg-indigo-900/10"
                            name="last_name"
                            onChange={handleChange}
                            value={formData.last_name}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Position</label>
                        <input 
                            type="text"
                            className="w-full p-1 rounded-lg border hover:border-indigo-400 bg-indigo-900/10"
                            name="position"
                            onChange={handleChange}
                            value={formData.position}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Employment Status</label>
                        <input 
                            type="text"
                            className="w-full p-1 rounded-lg border hover:border-indigo-400 bg-indigo-900/10"
                            name="employment_status"
                            onChange={handleChange}
                            value={formData.employment_status}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Department - Office</label>
                        <select 
                            className="w-full p-1 rounded-lg border hover:border-indigo-400 bg-indigo-900/10"
                            name="department"
                            onChange={handleChange}
                            value={formData.department}
                            required
                        >
                            <option className="bg-slate-900 hover:bg-blue-900 checked:bg-blue-900">-- Select Department --</option>
                            {
                                department.map((item,id)=>{
                                    return(
                                        <option className="bg-slate-900 hover:bg-blue-900 checked:bg-blue-900" key={id} value={item._id}>{item.department_name} {item.office_name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="w-full py-6 flex gap-2">
                        <Link
                            href={'/data-entry/employee'}
                            className="block text-center w-full md:w-1/2 p-2 rounded-lg bg-slate-800 hover:bg-slate-800/80 text-white"
                        >
                            back
                        </Link>
                        <button
                            type="submit"
                            className="w-full md:w-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white"
                        >
                            save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}