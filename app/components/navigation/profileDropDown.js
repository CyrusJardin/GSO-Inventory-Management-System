'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { BsPersonVcard } from "react-icons/bs"
import { MdKeyboardArrowDown } from "react-icons/md"
import LogoutButton from "../logoutButton"
import axios from "axios"

export default function ProfileDropDown () {

    const [openProfile, setOpenProfile] = useState(false)
    const [userData, setUserData] = useState([])

    useEffect(()=>{
        const getUserData = async () => {
            try {
                await axios.get('/api/user')
                .then(res=>{
                    console.log(res)
                    setUserData(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        getUserData()
    }, [])

    const drop = event => {
        event.preventDefault()
        setOpenProfile(!openProfile)
    }

    return (
        <div className="relative hidden md:block">
            <button 
                onClick={drop}
                className="flex p-2 rounded-lg justify-between gap-2"
            >
                <span className="text-sm">
                    {userData?.first_name} {userData?.last_name}
                </span>
                <MdKeyboardArrowDown className="w-6 h-6" />
            </button>
            {
                openProfile && (
                    <div className="absolute space-y-2 top-20 -right-1 border border-slate-900 z-50 w-full md:w-[360px] rounded bg-white p-6">
                        <Link
                            href={'/profile'}
                            className="flex justify-start block w-full p-2 border border-gray-600 text-gray-600 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                            <div className="w-10 p-2">
                                <BsPersonVcard className="w-10 h-10" />
                            </div>
                            <div className="w-full p-2">
                                <p className="text-center font-bold">view my profile</p>
                                <p className="text-center text-sm">{userData?.first_name} {userData?.last_name}</p>
                            </div>
                        </Link>
                        <LogoutButton
                            className="w-full p-2 border border-gray-600 text-gray-600 hover:text-white hover:bg-slate-800 rounded-lg"
                        />
                    </div>
                )
            }
        </div>
    )
}