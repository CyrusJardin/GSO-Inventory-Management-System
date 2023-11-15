import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GSO Inventory Management System',
  description: 'Capstone Project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className+' bg-gray-200'}>{children}</body>
    </html>
  )
}
