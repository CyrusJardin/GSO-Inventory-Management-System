'use client'

import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useState } from "react"
import { useBarcode } from "next-barcode"
import Barcode from "react-barcode"

export default function QrCode ({ isHidden, hiddenChange, code }) {

    const [useBarCode, setUseBarCode] = useState(true)
    const [barcodeVal, setBarcodeVal] = useState('sample')

    const downloadQRCode = () => {
        // e.preventDefault()
        const qrCodeURL = document.getElementById('qrCode')
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
        console.log(qrCodeURL)
        let aEl = document.createElement("a")
        aEl.href = qrCodeURL;
        aEl.download = code+".png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    }

    const GenerateBarcodeImage = () => {
        const {inputRef} = useBarcode({
            value: barcodeVal
        })

        return <img id="barcodeImage" ref={inputRef} />
    }

    const downloadBarcodeImage = () => {
        const i = document.getElementById('barcodeImage')
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = i.width;
        canvas.height = i.height;

        context.drawImage(i, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = code+'.png'; 

        a.click()
    }

    useEffect(()=>{
        const onChangeBarcode = () => {
            if(code) {
                setBarcodeVal(code)
            }
            else {
                setBarcodeVal('sample')
            }
        }
        onChangeBarcode()
    }, [code])

    return (
        <div className={`fixed z-50 w-full h-full bg-slate-900/50 flex justify-center items-center ${isHidden ? 'hidden' : ''}`}>
            <div className="border border-white rounded-lg p-6">
                <div className="space-y-2">
                    <button
                        onClick={()=>setUseBarCode(!useBarCode)}
                        className="p-1 bg-white rounded-lg text-slate-900 w-full"
                    >
                        switch to {useBarCode ? <span>QR Code</span> : <span>Barcode</span>}
                    </button>
                    {
                        useBarCode ?
                        <div className="space-y-2">
                            <GenerateBarcodeImage />
                            <button
                                type="button"
                                className="w-full p-2 rounded-lg border border-white text-white"
                                onClick={downloadBarcodeImage}
                            >
                                save
                            </button>
                        </div>
                        :
                        <div className="space-y-2">
                            <QRCodeCanvas 
                                id="qrCode"
                                value={code}
                                size={300}
                                level={"H"}
                            />
                            <button
                                type="button"
                                onClick={()=>downloadQRCode()}
                                className="w-full p-2 rounded-lg border border-white text-white"
                                disabled={!code}
                            >
                                save
                            </button>
                        </div>
                    }
                    <button
                        type="button"
                        className="w-full p-2 rounded-lg border border-white text-white"
                        onClick={()=>hiddenChange(true)}
                    >
                        close
                    </button>
                </div>
            </div>
        </div>
    )
}