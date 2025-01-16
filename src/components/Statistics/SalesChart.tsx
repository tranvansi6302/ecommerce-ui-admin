import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { format, subDays } from 'date-fns'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'

// Đăng ký các components cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Interface cho dữ liệu thống kê
interface SalesData {
    date: string
    revenue: number
    orders: number
}

// Giả lập dữ liệu
const generateMockData = (days: number): SalesData[] => {
    return Array.from({ length: days }).map((_, index) => ({
        date: format(subDays(new Date(), index), 'yyyy-MM-dd'),
        revenue: Math.floor(Math.random() * 10000000) + 1000000,
        orders: Math.floor(Math.random() * 100) + 10
    }))
}

export default function SalesChart() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('week')

    // Lấy dữ liệu theo khoảng thời gian
    const getData = () => {
        switch (timeRange) {
            case 'week':
                return generateMockData(7)
            case 'month':
                return generateMockData(30)
            case 'quarter':
                return generateMockData(90)
            case 'year':
                return generateMockData(365)
            default:
                return generateMockData(7)
        }
    }

    const data = getData()

    const chartData = {
        labels: data.map((item) => format(new Date(item.date), 'dd/MM/yyyy')),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: data.map((item) => item.revenue),
                backgroundColor: 'rgba(53, 162, 235, 0.5)'
            },
            {
                label: 'Số đơn hàng',
                data: data.map((item) => item.orders),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'Thống kê doanh thu và đơn hàng'
            }
        }
    }

    return (
        <div className='p-6 bg-white rounded-lg shadow-lg'>
            <div className='mb-6 flex gap-4'>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setTimeRange('week')}
                >
                    Tuần
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setTimeRange('month')}
                >
                    Tháng
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        timeRange === 'quarter' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setTimeRange('quarter')}
                >
                    Quý
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setTimeRange('year')}
                >
                    Năm
                </button>
            </div>

            <div className='h-[400px]'>
                <Bar options={options} data={chartData} />
            </div>

            {/* Thống kê tổng quan */}
            <div className='mt-6 grid grid-cols-3 gap-4'>
                <div className='p-4 bg-blue-50 rounded-lg'>
                    <h3 className='text-lg font-semibold text-blue-700'>Tổng doanh thu</h3>
                    <p className='text-2xl font-bold'>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(data.reduce((sum, item) => sum + item.revenue, 0))}
                    </p>
                </div>
                <div className='p-4 bg-red-50 rounded-lg'>
                    <h3 className='text-lg font-semibold text-red-700'>Tổng đơn hàng</h3>
                    <p className='text-2xl font-bold'>{data.reduce((sum, item) => sum + item.orders, 0)} đơn</p>
                </div>
                <div className='p-4 bg-green-50 rounded-lg'>
                    <h3 className='text-lg font-semibold text-green-700'>Trung bình/ngày</h3>
                    <p className='text-2xl font-bold'>
                        {Math.round(data.reduce((sum, item) => sum + item.orders, 0) / data.length)} đơn
                    </p>
                </div>
            </div>
        </div>
    )
}
