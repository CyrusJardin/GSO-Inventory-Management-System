'use client'

import { useEffect, useState } from "react"

export default function SelectYear ({ className, onSetChange }) {
    const [years, setYears] = useState([])

    const setYearArray = () => {
        const date = new Date()
        for (let index = date.getFullYear(); index > (date.getFullYear() - 10) ; index--) {
            setYears( arr => [...arr, `${index}`]);
        }
    }

    useEffect(()=>{
        setYearArray()
    }, [])

    return (
        <select className={className} onChange={onSetChange}>
            {
                years.map((item, id)=>{
                    return(
                        <option key={id} value={item}>{item}</option>
                    )
                })
            }
        </select>
    )
}