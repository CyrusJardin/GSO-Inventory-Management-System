'use client'

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from "axios";
import { getMonthlyRelease, getMonthlyStock } from "@/app/hooks/todayDate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Stock and Releases',
    },
  }
}

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export default function ChartCard () {

  

  const [stocks, setStocks] = useState([])
  const [releases, setReleases] = useState([])

    const [state, setState] = useState({
      options: {
        chart: {
          id: "basic-line"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
        series: [
          {
            name: "New Item",
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
          },
    
          {
            name: "Borrowed Item",
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
          },
        ],
      });

      useEffect(() => {
        const getData = async () => {
          try {
            await axios.get('/api/dashboard')
            .then(res=>{
              setStocks(getMonthlyStock(res.data.stock))
              setReleases(getMonthlyRelease(res.data.release))
            })
            .catch(err=>{
              console.log(err)
            })
          } catch (error) {
            console.log(error)
          }
        }
        getData()
      }, [stocks, releases])

      const data = {
        labels,
        datasets: [
          {
            label: 'Stock',
            data: stocks,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Released',
            data: releases,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      }

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-md p-10 md:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full gap-3 sm:gap-5">
          <div className="flex w-full md:w-46">
            <span className="flex h-5 w-5 p-1 items-center justify-center rounded-full border border-cyan-400">
              <span className="block h-2 w-2 bg-cyan-400 rounded-full"></span>
            </span>
            <div className="w-full">
              <p className="font-bold text-cyan-400">Total New Item</p>
              <p className="text-sm font-medium">01.01.{new Date().getFullYear()} - 12.31.{new Date().getFullYear()}</p>
            </div>
          </div>
          <div className="flex w-full md:w-46">
            <span className="flex h-5 w-5 p-1 items-center justify-center rounded-full border border-indigo-600">
              <span className="block h-2 w-2 bg-indigo-600 rounded-full"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-indigo-600">Total Released Item</p>
              <p className="text-sm font-medium">01.01.{new Date().getFullYear()} - 12.31.{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
        
      </div>
          <div>
            <div id="chartOne" className="h-[300px] w-full">
              <Line options={options} data={data} />
            </div>
          </div>
        </div>
    )
}