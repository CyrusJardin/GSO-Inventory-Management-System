'use client'

import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import { getWeeklyRelease, getWeeklyStocks } from "@/app/hooks/todayDate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function BorrowedItemChart () {

  const [stocks, setStocks] = useState([])
  const [releases, setReleases] = useState([])

  useEffect(()=>{
    const getData = async () => {
      try {
        await axios.get('/api/dashboard')
        .then(res=>{
          setStocks(getWeeklyStocks(res.data.stock))
          setReleases(getWeeklyRelease(res.data.release))
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

  const options = {
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Stock and Releases Graph',
      },
    },
  }

  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const data = {
    labels,
    datasets: [
      {
        label: 'Stock',
        data: stocks,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Released',
        data: releases,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-indigo-900/10 text-white p-10 shadow-md md:col-span-4">
          <div className="mb-4 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-xl font-semibold">
                Total Cost This Week
              </h4>
            </div>
          </div>
          <div>
            <div id="chartTwo" className="-ml-5 -mb-9">
              <Bar options={options} data={data} />
            </div>
          </div>
        </div>
    )
}