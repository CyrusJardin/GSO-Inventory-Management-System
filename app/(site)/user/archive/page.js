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
        getData()
    }, [])

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="w-full flex bg-white shadow-md rounded-lg p-6">
                    <Link
                        href={'/user'}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-900/80 text-center text-white w-full md:w-1/3"
                    >
                        back
                    </Link>
                </div>
                <div className="w-full bg-white shadow-md rounded-lg p-6">
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
                                                <td className="p-2">{item.first_name} {item.last_name}</td>
                                                <td className="p-2">{item.username}</td>
                                                <td className="p-2"><DateFrame dateStr={item.deletedAt} /></td>
                                                <td className="space-y-2 p-2">
                                                    <button
                                                        onClick={()=>restoreUser(item._id)}
                                                        className="w-full p-2 rounded-lg bg-teal-600 hover:bg-teal-600/80 text-white"
                                                    >
                                                        restore
                                                    </button>
                                                    <button
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