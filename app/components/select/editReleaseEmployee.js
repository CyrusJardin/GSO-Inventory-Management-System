'use client'

import Select from "react-select"

export default function EditReleaseEmployee ({ defaultItem, options, setItem }) {

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? 'border-indigo-900' : 'border-indigo-400',
            boxShadow: state.isFocused ? '0 0 0 1px #3498db' : 'none',
            '&:hover': {
                borderColor: 'border-gray-400',
            },
            backgroundColor: 'bg-indigo-900/10'
        }),
      };

    return <Select 
        options={options}
        value={defaultItem}
        onChange={setItem}
        styles={customStyles}
    />
}