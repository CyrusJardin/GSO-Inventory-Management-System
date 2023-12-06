import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GSO Inventory Management System',
  description: 'Capstone Project',
}

export default function RootLayout({ children }) {
  return (
    <React.StrictMode>
      <html lang="en">
        <body className={inter.className+' bg-[#050212]'}>{children}</body>
      </html>
    </React.StrictMode>
  )
}
