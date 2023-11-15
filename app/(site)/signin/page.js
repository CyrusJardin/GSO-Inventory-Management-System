'use client'

import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Swal from "sweetalert2"
import { ImSpinner10 } from "react-icons/im"

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
    <div className="absolute h-full w-full bg-gray-200 flex justify-center items-center p-6">
      {
        isLoading && (
          <div className="fixed w-full h-full z-50 bg-slate-800/90 flex justify-center items-center text-white">
            <ImSpinner10 className="w-5 h-5 animate-spin" />
          </div>
        )
      }
      <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
        <p className="mb-10">
          <Image 
            src={'/images/logo/logo-dark.svg'}
            width={300}
            height={100}
            alt="logo" 
            priority={true}
          />
        </p>
        <form onSubmit={submitForm} className="space-y-5">
          <div>
            <label className="text-xs font-bold">Username</label>
            <input 
              type="text"
              className="w-full p-2 border rounded-lg hover:border-black"
              name="username"
              onChange={handleForm}
              value={signInForm.username}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold">Password</label>
            <input 
              type="password"
              className="w-full p-2 border rounded-lg hover:border-black"
              name="password"
              onChange={handleForm}
              value={signInForm.password}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full md:w-1/2 p-2 rounded-lg text-white bg-blue-400 hover:bg-blue-600 hover:font-bold"
            >
              login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}