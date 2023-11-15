'use client'

import Select from "react-select"

export default function EditReleaseEmployee ({ defaultItem, options, setItem }) {
    return <Select 
        options={options}
        value={defaultItem}
        onChange={setItem}
    />
}