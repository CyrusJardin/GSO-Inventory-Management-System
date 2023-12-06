'use client';

import DateFrame from "@/app/components/dateFrame";
import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import Swal from "sweetalert2";

export default function Archive () {

    const [archive, setArchive] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        try {
            setIsLoading(true)
            await axios.get('/api/release/archive')
            .then(res=>{
                setArchive(res.data.data)
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
        getData()
    }, [])

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
            await axios.post('/api/release/destroy', {id: id})
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

    const restore = async id => {
        try {
            await axios.post('/api/release/restore', {id: id})
            .then(res=>{
                getData()
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6">
                <div className="bg-indigo-900/10 border border-white text-white rounded-lg shadow-md p-6 w-full">
                    <div className="w-full h-96 overflow-scroll">
                        {
                            isLoading ?
                            <div className="relative w-full h-full">
                                <div className="absolute w-full h-full bg-slate-900 text-white flex justify-center items-center">
                                    <ImSpinner10 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                            :
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th>Inventory Tag</th>
                                        <th>Item Name</th>
                                        <th>Property Number</th>
                                        <th>Date Deleted</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        archive.map((item, index)=>{
                                            return (
                                                <tr key={index}>
                                                    <td>{item?.inventory?.inventory_tag}</td>
                                                    <td>{item?.item?.item_name}</td>
                                                    <td>{item?.item?.property_number}</td>
                                                    <td><DateFrame dateStr={item?.deletedAt} /></td>
                                                    <td className="flex gap-2 p-2">
                                                        <button
                                                            onClick={()=>restore(item._id)}
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
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}