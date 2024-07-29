import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    ArcElement
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    ArcElement
  );


const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
    //   label: 'My First Dataset',
      data: [65, 59, 80],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };


type Props = {
  show: boolean
  messageId: string
}

const ChartView = ({show, messageId}: Props) => {
    const [loading, isLoading] = useState(false)
    const [chartData, setChartData] = useState(null)
    useEffect(()=> {
      const fetchData = async(messageId: string) => {
        isLoading(true)
        try {
          const response = await fetch(`/api/chart?messageId=${messageId}`)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const json = await response.json()
          setChartData(json)
          console.log(json)
        } catch (error) {
          console.log(error)
        }
        isLoading(false)
      }

      if(!chartData && show) {
        fetchData(messageId)
      }
    },[show])

    if(!show) return null

    if(show && loading) return <div>Loading....</div>

    if(chartData) {
      return (
        <Chart data={chartData} type="line" />
    )
    }


}

export default ChartView