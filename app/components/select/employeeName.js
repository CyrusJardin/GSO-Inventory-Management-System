'use client'

import axios from "axios"
import { useEffect, useState } from "react"

export default function EmployeeName ({ className, onChangeEmployee, onChangeDetails, defaultEmployee, toActivate, month, year }) {
    const [employees, setEmployees] = useState([])

    const getEmployees = async () => {
        try {
            await axios.get('/api/employee')
            .then(res=>{
                setEmployees(res.data.data)
            })
            .catch(err=>{
                console.log(err)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleEmployeeChange = (e) => {
        onChangeEmployee(e.target.value)
        let selectedEmployee = employees.find(emp => emp._id == e.target.value)
        onChangeDetails({
            department: selectedEmployee?.department?.department_name,
            status: selectedEmployee?.employment_status,
            position: selectedEmployee?.position,
            name: selectedEmployee?.first_name + ' ' + selectedEmployee?.last_name
        })
        toActivate(selectedEmployee._id, month, year)
    }

    useEffect(()=>{
        getEmployees()
    }, [])
    
    return <select className={className} onChange={handleEmployeeChange} value={defaultEmployee}>
            <option className="bg-slate-900 text-white checked:bg-blue-400">-- Select Employee --</option>
        {
            employees.map((item,id)=>{
                return (
                    <option className="bg-slate-900 text-white checked:bg-blue-400" key={id} value={item._id}>{item.first_name} {item.last_name}</option>
                )
            })
        }
    </select>
}