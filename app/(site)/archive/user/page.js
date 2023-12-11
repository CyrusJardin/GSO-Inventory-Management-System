'use client';

import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Archive () {

    const [archive, setArchive] = useState([])

    const restoreUser = async (id) => {
        try {
            await axios.post('/api/user/archive', {id:id})
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

    const confirmRestore = id => {
        Swal.fire({
            title: 'Restore User',
            text: 'Are you sure you want to restore User?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                restoreUser(id)
            }
        })
    }

    const confirmDelete = id => {
        Swal.fire({
            title: 'Delete User',
            text: 'Are you sure you want to delete User?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })
        .then(res=>{
            if (res.isConfirmed) {
                deleteUser(id)
            }
        })
    }

    const deleteUser = async (id) => {
        try {
            await axios.post('/api/user/destroy', {id: id})
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
            await axios.get('/api/user/archive')
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
                <div className="w-full bg-indigo-900/10 border border-white text-white shadow-md rounded-lg p-6">
                    <div className="w-full h-96 overflow-y-scroll">
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Date Deleted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    archive.map((item, index)=>{
                                        return(
                                            <tr key={index} className="border-b border-slate-900">
                                                <td className="p-2 border border-slate-900">{item.first_name} {item.last_name}</td>
                                                <td className="p-2 border border-slate-900">{item.username}</td>
                                                <td className="p-2 border border-slate-900"><DateFrame dateStr={item.deletedAt} /></td>
                                                <td className="space-y-2 p-2 border border-slate-900">
                                                    <button
                                                        onClick={()=>confirmRestore(item._id)}
                                                        className="w-full p-2 rounded-lg bg-teal-600 hover:bg-teal-600/80 text-white"
                                                    >
                                                        restore
                                                    </button>
                                                    <button
                                                        onClick={()=>confirmDelete(item._id)}
                                                        className="w-full p-2 rounded-lg bg-red-600 hover:bg-red-600/80 text-white"
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