'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function Create () {

    const [department, setDepartment] = useState([])
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        employment_status: '',
        dep: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const getDepartmentArray = async () => {
        try {
            await axios.get('/api/department/data-entry')
            .then(res=>{
                setDepartment(res.data.data)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        getDepartmentArray()
    }, [department])

    const createEmployee = async (e) => {
        try {
            e.preventDefault()
            await axios.post('/api/employee', formData)
            .then(res=>{
                setFormData({
                    first_name: '',
                    last_name: '',
                    position: '',
                    employment_status: '',
                    dep: '',
                })
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
            <div className="absolute w-full md:w-4/5 top-20 h-full right-0 p-6 flex justify-center items-center">
                <form onSubmit={createEmployee} className="w-full md:w-3/5 bg-white p-6 rounded-lg">
                    <div className="w-full p-6">
                        <p className="text-2xl text-center font-bold">Create New Employee</p>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">First Name</label>
                        <input 
                            type="text"
                            className="w-full p-1 rounded-lg border hover:border-black"
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
                            className="w-full p-1 rounded-lg border hover:border-black"
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
                            className="w-full p-1 rounded-lg border hover:border-black"
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
                            className="w-full p-1 rounded-lg border hover:border-black"
                            name="employment_status"
                            onChange={handleChange}
                            value={formData.employment_status}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Department - Office</label>
                        <select 
                            className="w-full p-1 rounded-lg border hover:border-black"
                            name="dep"
                            onChange={handleChange}
                            value={formData.dep}
                            required
                        >
                            <option>-- Select Department --</option>
                            {
                                department.map((item,id)=>{
                                    return(
                                        <option key={id} value={item._id}>{item.department_name} {item.office_name}</option>
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