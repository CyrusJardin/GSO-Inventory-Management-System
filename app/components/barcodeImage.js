'use client';

import { useBarcode } from "next-barcode";
import html2canvas from "html2canvas";

export default function BarcodeImage ({ code }) {

    const {inputRef} = useBarcode({
        value: code
    })

    const downloadBarcode = () => {
        const barcodeImage = inputRef.current;
    
        if (barcodeImage) {
            html2canvas(barcodeImage).then((canvas) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `barcode_${code}.png`;
        
                link.click();
            });
        }
    }

    return (
        <div className="space-y-2">
            <img ref={inputRef} />
            <button
                onClick={downloadBarcode}
                className="w-full bg-slate-900 text-white hover:bg-slate-900/80"
            >
                download
            </button>
        </div>
    )
}