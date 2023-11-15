'use client'

import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"
import { TbCurrencyPeso } from "react-icons/tb"

export default function CardDataSet ({ title, total, rate, levelUp, levelDown, children }) {
    return (
        <div className="rounded-sm border border-stroke bg-white py-6 px-7 shadow-md dark:bg-boxdark">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-900/10 text-indigo-600">
                {children}
            </div>

            <div className="mt-4 items-end justify-start">
                <div>
                    <h4 className="text-2xl font-bold text-black flex">
                        <TbCurrencyPeso className="w-8 h-8" />{total}
                    </h4>
                </div>
                <span
                    className={`flex justify-between items-center gap-1 text-xs font-medium text-green-500`}
                    >
                    <span className="text-sm font-medium text-gray-400">{title}</span>
                    <div className="flex gap-1">
                        {rate}%
                        <AiOutlineArrowUp className="w-4 h-4 text-green-500" />
                    </div>
                </span>
            </div>
        </div>
    )
}