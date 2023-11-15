'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Employee () {

    const [archive, setArchive] = useState([])

    const restoreEmployee = async (id) => {
        try {
            await axios.post('/api/employee/archive', {id:id})
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
    const confirmDelete = id => {
        Swal.fire({
            title: 'Continue?',
            icon: 'warning',
            text: 'Are you sure you want to delete? Once deleted, it can not be restored.',
            showCancelButton: true,
            showConfirmButton: true,
        })
        .then(res=>{
            if (res.isConfirmed) {
                destroy(id)
            }
        })
    }

    const destroy = async id => {
        try {
            await axios.post('/api/employee/destroy', {id: id})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.response.data.message)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const getData = async () => {
        try {
            await axios.get('/api/employee/archive')
            .then(res=>{
                setArchive(res.data.data)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full bg-white shadow-md rounded-lg p-6">
                    <div className="w-full h-96 overflow-y-scroll">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Office</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    archive.map((item, index)=>{
                                        return(
                                            <tr key={index}>
                                                <td className="p-2">{item.first_name} {item.last_name}</td>
                                                <td className="p-2">{item?.department?.department_name}</td>
                                                <td className="p-2">{item?.department?.office_name}</td>
                                                <td className="text-white flex gap-2 p-2">
                                                    <button
                                                        onClick={()=>restoreEmployee(item._id)}
                                                        className="p-2 w-full rounded-lg bg-teal-600 hover:bg-teal-600/80 text-white"
                                                    >
                                                        restore
                                                    </button>
                                                    <button
                                                        onClick={()=>confirmDelete(item._id)}
                                                        className="p-2 w-full rounded-lg bg-red-600 hover:bg-red-600/80"
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
        </div>
    )
}