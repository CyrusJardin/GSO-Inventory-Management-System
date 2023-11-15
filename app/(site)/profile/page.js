'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { useEffect, useState } from "react";
import axios from "axios";
import bcryptjs from "bcryptjs";
import Swal from "sweetalert2";

export default function Profile () {

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        username: '',
        password: '',
        current_password: '',
        confirm_password: '',
        new_password: ''
    })

    const handleUserForm = e => {
        const {name, value} = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const validator = () => {
        let result = true
        
        if (userData.current_password === userData.confirm_password) {
            result = false
            Swal.fire('Confirm password did not match')
        }
        if (!bcryptjs.compare(userData.current_password, userData.password)) {
            result = false
            Swal.fire('Invalid password')
        }
        return result
    }

    const updateForm = async () => {
        try {
            if (validator()) {
                await axios.post('', userData)
                .then(res=>{
                    setUserData({
                        ...userData,
                        password: '',
                        current_password: '',
                        confirm_password: '',
                        new_password: ''
                    })
                    Swal.fire(res.data.message)
                })
                .catch(err=>{
                    Swal.fire(err.message)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateProfile = async () => {
        try {
            await axios.post('/api/user/update-profile', {first_name: userData.first_name, last_name: userData.last_name, position: userData.position})
            .then(res=>{
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getUserData = async () => {
            try {
                await axios.get('/api/user')
                .then(res=>{
                    setUserData({
                        ...userData,
                        first_name: res.data.data.first_name,
                        last_name: res.data.data.last_name,
                        username: res.data.data.username,
                        password: res.data.data.password,
                        position: res.data.data.position
                    })
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

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 space-y-2">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-2">
                    <p className="font-bold">Personal Information</p>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <label className="text-xs font-bold">First Name</label>
                            <input 
                                type="text"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="first_name"
                                onChange={handleUserForm}
                                value={userData.first_name}
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-xs font-bold">Last Name</label>
                            <input 
                                type="text"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="last_name"
                                onChange={handleUserForm}
                                value={userData.last_name}
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-xs font-bold">Position</label>
                            <input 
                                type="text"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="position"
                                onChange={handleUserForm}
                                value={userData.position}
                            />
                        </div>
                    </div>
                    <button type="button" onClick={updateProfile} className="w-full md:w-1/6 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-600/80">
                        save
                    </button>
                </div>
                <form onSubmit={updateForm} className="bg-white rounded-lg shadow-md p-6 space-y-2">
                    <p className="font-bold">Account Settings</p>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <label className="text-xs font-bold">Username</label>
                            <input 
                                type="text"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="username"
                                onChange={handleUserForm}
                                value={userData.username}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-xs font-bold">New Password</label>
                            <input 
                                type="password"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="new_password"
                                onChange={handleUserForm}
                                value={userData.new_password}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <label className="text-xs font-bold">Current Password</label>
                            <input 
                                type="password"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="current_password"
                                onChange={handleUserForm}
                                value={userData.current_password}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-xs font-bold">Confirm Password</label>
                            <input 
                                type="password"
                                className="w-full border hover:border-black rounded-lg p-2"
                                name="confirm_password"
                                onChange={handleUserForm}
                                value={userData.confirm_password}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-1/6 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-600/80">
                        save
                    </button>
                </form>
            </div>
        </div>
    )
}