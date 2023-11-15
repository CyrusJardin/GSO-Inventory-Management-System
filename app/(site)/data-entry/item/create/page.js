'use client';

import SideNav from "@/app/components/navigation/sideNav";
import TopNav from "@/app/components/navigation/topNav";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";
import QrCode from "@/app/components/qrCode";
import { BsTrash } from "react-icons/bs";

export default function Create () {

    const [isScanModalOpen, setIsScanModalOpen] = useState(false)
    const [isCodeGenerateModalOpen, setIsCodeGenerateModalOpen] = useState(true)
    const [scanResult, setScanResult] = useState(null);
    const [itemForm, setItemForm] = useState({
        item_name: '',
        property_number: '',
        description: [''],
        barcode_text: '',
        unit: ''
    })

    const handleFormChange = e => {
        const {name, value} = e.target
        setItemForm({
            ...itemForm,
            [name]: value
        })
    }

    const confirmClose = () => {
        Swal.fire({
            title: 'Close Scanner?',
            icon: 'question',
            showConfirmButton: true,
            confirmButtonText: 'OK'
        })
        .then(res=>{
            if(res.isConfirmed) {
                setIsScanModalOpen(false)
            }
        })
    }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });
  
    scanner.render(success, error);
  
    function success(result) 
    {
      scanner.clear();
      setScanResult(result);
    }
  
    function error(err)
    {
      console.log(err);
    }
  }, [])

    const saveItem = async (e) => {
        try {
            e.preventDefault()
            await axios.post('/api/item/create', itemForm)
                .then(res=>{
                    console.log(res.data.message)
                    setItemForm({
                        item_name: '',
                        barcode_text: '',
                        property_number: '',
                        unit: '',
                        description: ['']
                    })
                    Swal.fire(res.data.message)
                })
                .catch(err=>{
                    Swal.fire(err.response.data.message)
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    const showGenerateCodeModal = () => {
        if(itemForm.barcode_text == '') {
            Swal.fire({
                title: 'Barcode is null',
                icon: 'error',
                text: 'Enter the barcode text to generate the barcode image'
            })
        } else {
            setIsCodeGenerateModalOpen(false)
        }
    }

    const handleDescriptionChange = (index, event) => {
        const updatedDescriptions = [...itemForm.description]
        updatedDescriptions[index] = event.target.value
    
        setItemForm({
          ...itemForm,
          description: updatedDescriptions,
        })
    }

    const addDescriptionField = () => {
        setItemForm({
          ...itemForm,
          description: [...itemForm.description, ''],
        });
    }

    const deleteDescriptionField = (index) => {
        const updatedDescriptions = [...itemForm.description]
        updatedDescriptions.splice(index, 1)
    
        setItemForm({
          ...itemForm,
          description: updatedDescriptions,
        })
    }

    return (
        <div>
            <TopNav />
            <SideNav />
            <QrCode isHidden={isCodeGenerateModalOpen} hiddenChange={setIsCodeGenerateModalOpen} code={itemForm.barcode_text} />
            <div
                className={`fixed w-full flex justify-center items-center h-full bg-slate-900/90 z-50 ${isScanModalOpen ? '' : 'hidden'}`}
            >
                <div className="border border-white rounded-lg p-6">
                    {scanResult?
                        <h1>Success! {scanResult}</h1>
                        :
                        <div id='reader'></div>
                    }
                    <button
                        onClick={confirmClose}
                        className="w-full p-2 rounded-lg border-white border mt-2 text-white hover:font-bold"
                    >
                        close
                    </button>
                </div>
            </div>
            <div className="absolute w-full md:w-4/5 top-20 right-0 p-6 flex justify-center items-center">
                <form onSubmit={saveItem} className="bg-white rounded-lg shadow-md p-6 w-full md:w-3/5">
                    <p className="text-center text-2xl font-bold">Create New Item</p>
                    <div className="w-full">
                        <label className="text-xs font-bold">Item Name</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="item_name"
                            onChange={handleFormChange}
                            value={itemForm.item_name}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Property Number</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="property_number"
                            onChange={handleFormChange}
                            value={itemForm.property_number}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Unit</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="unit"
                            onChange={handleFormChange}
                            value={itemForm.unit}
                            required
                        />
                    </div>
                    <div className="w-full relative">
                        <label className="text-xs font-bold">Barcode</label>
                        <input 
                            type="text"
                            className="w-full p-2 rounded-lg border hover:border-black"
                            name="barcode_text"
                            onChange={handleFormChange}
                            value={itemForm.barcode_text}
                            required
                        />
                        <button
                            type="button"
                            onClick={showGenerateCodeModal}
                            className="absolute text-[10px] font-bold block h-8 w-8 hover:w-20 hover:text-base duration-500 right-10 top-7 rounded-full border bg-blue-400 text-white overflow-hidden"
                        >
                            generate
                        </button>
                        <button
                            type="button"
                            onClick={()=>setIsScanModalOpen(true)}
                            className="absolute text-[10px] font-bold block h-8 w-8 hover:w-20 hover:text-base duration-500 right-1 top-7 rounded-full border bg-green-400 text-white"
                        >
                            scan
                        </button>
                    </div>
                    <div className="w-full">
                        <label className="text-xs font-bold">Item Description</label>
                        {itemForm.description.map((desc, index) => (
                            <div key={index} className="mb-2 flex gap-2">
                                <input
                                    type="text"
                                    value={desc}
                                    className="w-full p-2 rounded-lg border hover:border-black"
                                    onChange={(e) => handleDescriptionChange(index, e)}
                                />
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => deleteDescriptionField(index)}
                                        className="text-red-600 hover:text-red-600/80 p-2 rounded-lg border hover:border-red-600"
                                    >
                                        <BsTrash className="w-8 h-8" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="text-sm p-2 rounded-lg bg-green-600 hover:bg-green-600/80 text-white mt-2"
                            onClick={addDescriptionField}
                        >
                            Add Description Field
                        </button>
                    </div>
                    <div className="flex gap-2 w-full py-6">
                        <Link
                            href={'/data-entry/item'}
                            className="block p-2 rounded-lg bg-slate-800 hover:bg-slate-800/80 text-white text-center w-full md:w-1/2"
                        >
                            back
                        </Link>
                        <button
                            type="submit"
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-600/80 text-white w-full md:w-1/2"
                        >
                            save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}