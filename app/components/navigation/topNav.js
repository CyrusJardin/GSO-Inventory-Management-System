'use client'

import { HiMagnifyingGlass } from "react-icons/hi2"
import ProfileDropDown from "./profileDropDown"
import { useEffect, useState } from "react"
import { BiBell } from "react-icons/bi"
import axios from "axios"
import DateFrame from "../dateFrame"
import Spinner from "../spinner"
import { useRouter } from "next/navigation"

export default function TopNav () {
    const [searchItem, setSearchItem] = useState('')
    const [newNotification, setNewNotification] = useState(false)
    const [isLoading, setIsLoading] = useState([])
    const [notification, setNotification] = useState(false)
    const [notifications, setNotifications] = useState([])
    const router = useRouter()

    const readNotification = async () => {
        try {
            setNotification(!notification)
            await axios.get('/api/navigation/notification/read')
        } catch (error) {
            console.log(error)
        }
    }

    const checkNewNotifications = (notif) => {
        let result = false
        notif.forEach(element => {
            if(!element.status) {
                result = true
            }
        })
        setNewNotification(result)
    }

    const deleteNotification = async (id, index) => {
        try {
            const loadingArr = [...isLoading]
            loadingArr[index] = true
            setIsLoading(loadingArr)
            await axios.post('/api/navigation/notification/delete', {id:id})
        } catch (error) {
            console.log(error)
        }
    }

    const handleNotifications = arr => {
        const loadingArr = new Array(arr.length).fill(false)
        setNotifications(arr)
        setIsLoading(loadingArr)
    }

    const search = e => {
        e.preventDefault()
        router.push('/search/'+searchItem)
    }

    useEffect(()=>{
        const getData = async () => {
            try {
                await axios.get('/api/navigation/notification')
                .then(res=> {
                    handleNotifications(res.data.data)
                    checkNewNotifications(res.data.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }
        }
        setTimeout(()=>{
            getData()
        }, 2000)
    }, [notifications])

    return (
        <div className="fixed top-0 right-0 w-full md:w-4/5 h-20 z-50 bg-white">
            <form className="flex p-6" onSubmit={search}>
                <button
                    type="submit"
                >
                    <HiMagnifyingGlass className="w-6 h-6 hover:text-blue-600" />
                </button>
                <input 
                    type="text"
                    className="border-none outline-none p-2 md:w-1/2"
                    placeholder="Type to search..."
                    onChange={e=>setSearchItem(e.target.value)}
                />
                <button
                    type="button"
                    className="rounded-full"
                    onClick={readNotification}
                >
                    <BiBell className={`w-6 h-6 ${newNotification ? ' text-red-600' : ''}`} />
                </button>
                <ProfileDropDown />
            </form>
            <div className={`w-full md:w-1/5 p-6 fixed right-0 top-20 bottom-0 bg-slate-800 overflow-y-scroll border-l duration-300 ${notification ? "translate-x-0" : "translate-x-full"}`}>
                <p className="text-xl text-center text-gray-300">Notification</p>
                <ul className="space-y-4">
                    {
                        notifications.map((item, index)=>{
                            return (
                                <li key={index} className={`relative border-b ${item.status ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {
                                        isLoading[index] ? <Spinner /> : 
                                        <div>
                                            <p>{item.message}</p>
                                            <div className="flex justify-between mt-2">
                                                <p className="text-xs font-bold"><DateFrame dateStr={item.createdAt} /></p>
                                                <button
                                                    onClick={()=>deleteNotification(item._id, index)}
                                                    className="text-red-600 hover:font-bold text-xs"
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}