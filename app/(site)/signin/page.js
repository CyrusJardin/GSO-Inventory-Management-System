'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Swal from "sweetalert2"
import { ImSpinner10 } from "react-icons/im"
import { IoMdPerson } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";

export default function SignIn () {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [signInForm, setSignInForm] = useState({
    username: '',
    password: ''
  })

  const handleForm = (e) => {
    const {name, value} = e.target
    setSignInForm({
      ...signInForm,
      [name]: value
    })
  }

  const submitForm = async (e) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      await axios.post('/api/user/login', signInForm)
      .then(res=>{
        router.push('/')
      })
      .catch(err=>{
        setIsLoading(false)
        Swal.fire(err.response.data.message)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="absolute h-full w-full bg-gray-800 flex justify-center items-center p-6 login">
      {
        isLoading && (
          <div className="fixed w-full h-full z-50 bg-slate-800/90 flex justify-center items-center text-white">
            <ImSpinner10 className="w-5 h-5 animate-spin" />
          </div>
        )
      }
      <div className="w-full md:w-1/3 bg-white/10 border border-white shadow-md rounded-lg p-6">
        <div className="mb-10">
          {/* <Image 
            src={'/images/logo/logo-dark.svg'}
            width={300}
            height={100}
            alt="logo" 
            priority={true}
          /> */}
          <p className="text-center text-2xl text-gray-400">GSO</p>
          <p className="text-center text-sm text-gray-400">Inventory Management System</p>
        </div>
        <form onSubmit={submitForm} className="space-y-5">
          <div className="flex gap-2 items-center">
            {/* <label className="text-xs font-bold">Username</label> */}
            <IoMdPerson className="w-5 h-5 text-gray-400" />
            <input 
              type="text"
              className="w-full p-2 placeholder:text-gray-600"
              name="username"
              onChange={handleForm}
              value={signInForm.username}
              placeholder="Username"
              required
            />
          </div>
          <div className="flex gap-2 items-center">
            {/* <label className="text-xs font-bold">Password</label> */}
            <BiSolidLock className="w-5 h-5 text-gray-400" />
            <input 
              type="password"
              className="w-full p-2 placeholder:text-gray-600"
              name="password"
              onChange={handleForm}
              value={signInForm.password}
              placeholder="Password"
              required
            />
          </div>
          <div className="px-6">
            <button
              type="submit"
              className="w-full md:w-1/2 p-2 text-gray-400 bg-gray-800 hover:bg-gray-900 hover:font-bold"
            >
              login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}