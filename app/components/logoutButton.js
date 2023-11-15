'use client'

import axios from "axios"
import { useRouter } from "next/navigation"

export default function LogoutButton ({ className }) {

    const router = useRouter()

    const logout = async () => {
        try {
            await axios.get('/api/user/logout')
            .then(res=>{
                router.push('/signin')
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <button
            type="button"
            onClick={logout}
            className={className}
        >
            logout
        </button>
    )
}