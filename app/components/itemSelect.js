'use client'

import { useEffect, useState } from "react"
import Select from "react-select"
import axios from "axios"

export default function ItemSelect ({ className, onItemChange }) {

    const [option, setOption] = useState([])

    const handleSelectItem = e => {
        console.log(e)
        onItemChange(e)
    }

    useEffect(()=>{
        const getDatas = async () => {
            try {
                await axios.get('/api/inventory')
                .then(res=>{
                    console.log(res)
                    setOptionSelect(res.data.items)
                })
                .catch(err=>{
                    console.log(err.message)
                })
            } catch (error) {
                console.log(error.message)
            }
        }
        getDatas()
        function setOptionSelect(items) {
            let optionArr = []
            items.map(item=>{
                optionArr.push({value: item?._id, label: item?.item?.item_name ?? item?.item_name})
            })
            console.log(items)
            setOption(optionArr)
        }
    }, [])

    return (
        <Select 
            className={className}
            getOptionValue={handleSelectItem}
            options={option}
        />
    )
}