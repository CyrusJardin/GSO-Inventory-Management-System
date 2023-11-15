'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from 'next/image'
import SidebarLinkGroup from "./sidebarLinkGroup"
import { RxDashboard } from "react-icons/rx"
import { BsPerson, BsPersonWorkspace, BsPersonVcard } from "react-icons/bs"
import { HiOutlineBuildingOffice } from "react-icons/hi2"
import { MdOutlineInventory } from "react-icons/md"
import { LuFileInput } from "react-icons/lu"
import { AiOutlineScan } from "react-icons/ai"
import { ImMenu } from "react-icons/im"
import { BiScan } from "react-icons/bi"
import LogoutButton from "../logoutButton"

export default function SideNav () {

    const [sidebarOpen, setSideBarOpen] = useState(true)
    const pathname = usePathname()
    let storedSidebarExpanded = "true";
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    return (
        <div>
            <button
                onClick={()=>setSideBarOpen(true)}
                className="fixed top-7 right-2 z-50 md:hidden"
            >
                <ImMenu className="w-8 h-8 text-gray-600 border border-white active:border-slate-900 active:text-slate-900" />
            </button>
            <aside className={`fixed left-0 top-0 z-50 pt-6 flex h-screen w-full md:w-1/5 flex-col overflow-y-hidden bg-slate-800 duration-300 ease-linear 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                    <Link href="/">
                        <Image
                            width={176}
                            height={32}
                            src={"/images/logo/logo.svg"}
                            alt="Logo"
                            priority={false}
                        />
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls="sidebar"
                        aria-expanded={sidebarOpen}
                        className="block lg:hidden"
                    >
                    </button>
                </div>
                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-600">
                                MENU
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <SidebarLinkGroup
                                    activeCondition={pathname === "/" || pathname.includes("dashboard")}
                                >
                                {(handleClick, open) => (
                                    <div>
                                    <a
                                        href="#"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-200 duration-300 ease-in-out hover:bg-gray-700 ${
                                        (pathname === "/" || pathname.includes("dashboard")) &&
                                        "bg-gray-700"
                                        }`}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                        }}
                                    >
                                        Admin
                                    </a>
                                    <div
                                        className={`translate transform overflow-hidden ${
                                        !open && "hidden"
                                        }`}
                                    >
                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                            <li>
                                                <a
                                                    href="/"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname === "/" ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    <RxDashboard />
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/user"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname === "/user" ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    <BsPerson />
                                                    Users
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    </div>
                                )}
                                </SidebarLinkGroup>
                                <li>
                                    <Link 
                                        href={'/department'}
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out text-slate-200 hover:bg-gray-700 ${
                                            pathname == '/department' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <HiOutlineBuildingOffice />
                                        Department
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={'/employee'}
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out text-slate-200 hover:bg-gray-700 ${
                                            pathname == '/employee' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <BsPersonWorkspace />
                                        Employee
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={'/inventory'}
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out text-slate-200 hover:bg-gray-700 ${
                                            pathname == '/inventory' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <MdOutlineInventory />
                                        Inventory
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={'/scan'}
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out text-slate-200 hover:bg-gray-700 ${
                                            pathname == '/scan' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <BiScan />
                                        Scan
                                    </Link>
                                </li>
                                
                                <SidebarLinkGroup
                                activeCondition={pathname.startsWith('/archive')}
                                >
                                {(handleClick, open) => (
                                    <div>
                                    <a
                                        href="#"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-200 duration-300 ease-in-out hover:bg-gray-700 ${
                                        (pathname === "/archive" || pathname.includes("archive")) &&
                                        "bg-gray-700"
                                        }`}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                        }}
                                    >
                                        Archive
                                    </a>
                                    <div
                                        className={`translate transform overflow-hidden ${
                                        !open && "hidden"
                                        }`}
                                    >
                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                            <li>
                                                <a
                                                    href="/archive/inventory"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/archive/inventory") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Inventory
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/archive/release"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/archive/release") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Release
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/archive/office"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/archive/office") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Office
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/archive/employee"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/archive/employee") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Employee
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/archive/item"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/archive/item") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Item
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    </div>
                                )}
                                </SidebarLinkGroup>
                                <SidebarLinkGroup
                                activeCondition={pathname.startsWith('/data-entry')}
                                >
                                {(handleClick, open) => (
                                    <div>
                                    <a
                                        href="#"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-200 duration-300 ease-in-out hover:bg-gray-700 ${
                                        (pathname === "/data-entry" || pathname.includes("data-entry")) &&
                                        "bg-gray-700"
                                        }`}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                                        }}
                                    >
                                        Data Entry
                                    </a>
                                    <div
                                        className={`translate transform overflow-hidden ${
                                        !open && "hidden"
                                        }`}
                                    >
                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                            <li>
                                                <a
                                                    href="/data-entry/office"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/data-entry/office") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Office
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/data-entry/employee"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/data-entry/employee") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Employee
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="/data-entry/item"
                                                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white ${
                                                        pathname.includes("/data-entry/item") ? "text-white" : "text-slate-400"
                                                    } `}
                                                >
                                                    Item
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    </div>
                                )}
                                </SidebarLinkGroup>
                                <li>
                                    <Link 
                                        href={'/profile'}
                                        className={`md:hidden group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out text-slate-200 hover:bg-gray-700 ${
                                            pathname == '/profile' ? 'bg-gray-700' : ''
                                        }`}
                                    >
                                        <BsPersonVcard />
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <LogoutButton className={'w-full p-2 border border-white rounded-lg text-white md:hidden'} />
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={()=>setSideBarOpen(false)}
                            className="w-full md:hidden p-2 border border-gray-400 active:font-bold active:border-white rounded-lg text-white"
                        >
                            close
                        </button>
                    </nav>
                </div>
            </aside>
        </div>
    )
}