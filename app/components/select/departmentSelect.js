'use client'

import axios from "axios"
import { useEffect, useState } from "react"

export default function DepartmentSelect ({className, onHandleChange}) {

    const [department, setDepartment] = useState([])

    const setDepartmentOptions = async () => {
        try {
            await axios.get('/api/department/data-entry')
            .then(res=>{
                setDepartment(res.data.data)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        setDepartmentOptions()
    }, [])

    return(
        <select className={className} onChange={onHandleChange}>
            <option className="bg-slate-900 text-white checked:bg-blue-400">Departments</option>
            {
                department.map((item,id)=>{
                    return(
                        <option className="bg-slate-900 checked:bg-indigo-900" key={id} value={item.department_name}>{item.department_name} || {item.office_name}</option>
                    )
                })
            }
        </select>
    )
}