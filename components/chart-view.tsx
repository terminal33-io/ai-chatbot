import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    ArcElement,
    ChartType,
    ChartData,
    BarController,
    LineController,
    PieController
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
    ArcElement,
    BarController,
    LineController,
    PieController
  );


type Props = {
  show: boolean
  messageId: string
  chatId: string
  setChartLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type CData = ChartData & {
  type: ChartType
}

const ChartView = ({show, messageId, chatId, setChartLoading}: Props) => {
    const [chartData, setChartData] = useState<CData | null>(null)

    useEffect(()=> {
      const fetchData = async(messageId: string) => {
        setChartLoading(true)
        try {
          const response = await fetch('/api/chart',{
            method: 'POST',
            body: JSON.stringify({
              message_id: messageId,
              chat_id: chatId
            })
          })
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const json = await response.json()
          setChartData(json)
          console.log(json)
        } catch (error) {
          console.log(error)
        }
        setChartLoading(false)
      }

      if(!chartData && show) {
        fetchData(messageId)
      }
    },[show])

    if(!show) return null

    if(chartData) {
      return (
        <Chart data={chartData} type={chartData.type} />
    )
    }


}

export default ChartView