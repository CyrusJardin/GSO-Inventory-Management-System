'use client'

import { ImSpinner10 } from "react-icons/im"

export default function Spinner () {
    return (
        <div className="fixed flex justify-center items-center h-full w-full bg-slate-800/20">
            <ImSpinner10 className="w-4 h-4 animate-spin text-white" /> Loading
        </div>
    )
}