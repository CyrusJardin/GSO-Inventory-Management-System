'use client'

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function User () {

    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        username: '',
        pword: generatePassword(),
        position: ''
    })

    useEffect(()=>{
        getUserData()
    }, [users])

    const getUserData = async (e) => {
        try {
            await axios.get('/api/user/index')
            .then(res=>{
                setUsers(res.data.data)
                console.log(res)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteUser = async (id) => {
        try {
            await axios.post('/api/user/delete', {id:id})
            .then(res=>{
                setUsers(res.data.data)
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const addUser = async (e) => {
        try {
            e.preventDefault()
            await axios.post('/api/user/register', newUser)
            .then(res=>{
                setNewUser({
                    first_name: '',
                    last_name: '',
                    username: '',
                    pword: generatePassword(),
                    position: ''
                })
                setUsers(res.data.data)
                Swal.fire(res.data.message)
            })
            .catch(err=>{
                Swal.fire(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }

    function generatePassword() {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()_-+=<>?';
      
        const part1 = getRandomChar(uppercaseChars);
        const part2 = getRandomChar(specialChars);
        const part3 = getRandomChars(lowercaseChars + numberChars, 13);
      
        const password = part1 + part2 + part3;
      
        return shuffleString(password); 
    }
      
    function getRandomChar(characters) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    }
      
    function getRandomChars(characters, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
          result += getRandomChar(characters);
        }
        return result;
    }
      
    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    const generateNewPassword = () => {
        const newPassword = generatePassword()
        setNewUser({
          ...newUser,
          pword: newPassword,
        })
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <div className="absolute right-0 top-20 p-6 w-full md:w-4/5 space-y-2">
                <form className="w-full p-6 rounded-lg bg-white">
                    <div className="md:flex gap-2">
                        <div className="w-full md:w-1/3">
                            <label className="text-xs font-bold">Username</label>
                            <input 
                                type="text"
                                name="username"
                                className="w-full p-1 border hover:border-black rounded-lg"
                                onChange={handleChange}
                                value={newUser.username}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="text-xs font-bold">Password</label>
                            <input 
                                type="text"
                                name="pword"
                                className="w-full p-1 border hover:border-black rounded-lg"
                                onChange={handleChange}
                                value={newUser.pword}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block h-6"></label>
                            <button
                                type="button"
                                onClick={generateNewPassword}
                                className="p-1 border rounded-lg w-full bg-blue-700 text-white hover:font-bold hover:bg-blue-700/80"
                            >
                                new password
                            </button>
                        </div>
                    </div>
                    <div className="md:flex gap-2">
                        <div className="w-full md:w-1/3">
                            <label className="text-xs font-bold">First Name</label>
                            <input 
                                type="text"
                                name="first_name"
                                className="w-full p-1 border hover:border-black rounded-lg"
                                onChange={handleChange}
                                value={newUser.first_name}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="text-xs font-bold">Last Name</label>
                            <input 
                                type="text"
                                name="last_name"
                                className="w-full p-1 border hover:border-black rounded-lg"
                                onChange={handleChange}
                                value={newUser.last_name}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block h-6"></label>
                            <button
                                type="button"
                                onClick={addUser}
                                className="p-1 border rounded-lg w-full bg-teal-500 text-white hover:font-bold hover:bg-teal-500/80"
                            >
                                add user
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="text-xs font-bold">Position</label>
                        <input 
                            type="text"
                            className="w-full p-1 border rounded-lg hover:border-black"
                            name="position"
                            onChange={handleChange}
                            value={newUser.position}
                            required
                        />
                    </div>
                </form>
                
                <div className="w-full p-6 rounded-lg bg-white h-80 overflow-scroll">
                    <table className="table-auto w-full border">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Position</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((item,id)=>{
                                    return (
                                        <tr key={id}>
                                            <td>{item?.first_name} {item?.last_name}</td>
                                            <td>{item?.username}</td>
                                            <td>{item?.default_password}</td>
                                            <td>{item?.position}</td>
                                            <td className="p-2 text-white">
                                                {/* <button
                                                    className="w-1/2 p-1 rounded-lg bg-green-600 hover:bg-green-600/80"
                                                >
                                                    edit
                                                </button> */}
                                                <button
                                                    className="w-full p-1 rounded-lg bg-red-600 hover:bg-red-600/80"
                                                    onClick={()=>deleteUser(item._id)}
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
    )
}