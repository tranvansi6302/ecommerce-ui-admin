import {
    ArcElement,
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrency } from '../RevenueSale/utils/chart'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

// Utility functions for date handling
const getDateRangeOfWeek = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6) // End of week (Saturday)
    return { start, end }
}

const getMonthName = (date: Date) => {
    return `T${date.getMonth() + 1}/${date.getFullYear()}`
}

const getQuarterFromDate = (date: Date) => {
    return Math.floor(date.getMonth() / 3) + 1
}

// Mock data chỉ chứa timestamp và dữ liệu cơ bản
const mockWarehouseData = {
    stockHistory: [
        {
            timestamp: '2024-03-14T00:00:00.000Z',
            stock_in: 150,
            stock_in_value: 4500000000,
            stock_out: 120,
            stock_out_value: 3600000000,
            remaining_stock: 380
        },
        {
            timestamp: '2024-03-07T00:00:00.000Z',
            stock_in: 180,
            stock_in_value: 5400000000,
            stock_out: 160,
            stock_out_value: 4800000000,
            remaining_stock: 400
        },
        {
            timestamp: '2024-02-29T00:00:00.000Z',
            stock_in: 200,
            stock_in_value: 6000000000,
            stock_out: 180,
            stock_out_value: 5400000000,
            remaining_stock: 420
        },
        {
            timestamp: '2024-02-22T00:00:00.000Z',
            stock_in: 190,
            stock_in_value: 5700000000,
            stock_out: 170,
            stock_out_value: 5100000000,
            remaining_stock: 440
        },
        {
            timestamp: '2024-02-15T00:00:00.000Z',
            stock_in: 160,
            stock_in_value: 4800000000,
            stock_out: 140,
            stock_out_value: 4200000000,
            remaining_stock: 460
        },
        {
            timestamp: '2024-02-08T00:00:00.000Z',
            stock_in: 170,
            stock_in_value: 5100000000,
            stock_out: 150,
            stock_out_value: 4500000000,
            remaining_stock: 480
        },
        {
            timestamp: '2024-02-01T00:00:00.000Z',
            stock_in: 180,
            stock_in_value: 5400000000,
            stock_out: 160,
            stock_out_value: 4800000000,
            remaining_stock: 500
        }
    ],
    categoryStats: [
        {
            name: 'Điện thoại',
            stock_in: 850,
            stock_in_value: 25500000000,
            stock_out: 780,
            stock_out_value: 23400000000,
            remaining_stock: 70
        },
        {
            name: 'Laptop',
            stock_in: 450,
            stock_in_value: 18000000000,
            stock_out: 420,
            stock_out_value: 16800000000,
            remaining_stock: 30
        },
        {
            name: 'Máy tính bảng',
            stock_in: 300,
            stock_in_value: 9000000000,
            stock_out: 280,
            stock_out_value: 8400000000,
            remaining_stock: 20
        }
    ],
    brandStats: [
        {
            name: 'Apple',
            stock_in: 600,
            stock_in_value: 24000000000,
            stock_out: 550,
            stock_out_value: 22000000000,
            remaining_stock: 50
        },
        {
            name: 'Samsung',
            stock_in: 450,
            stock_in_value: 15750000000,
            stock_out: 420,
            stock_out_value: 14700000000,
            remaining_stock: 30
        },
        {
            name: 'Xiaomi',
            stock_in: 350,
            stock_in_value: 8750000000,
            stock_out: 330,
            stock_out_value: 8250000000,
            remaining_stock: 20
        },
        {
            name: 'Dell',
            stock_in: 200,
            stock_in_value: 4000000000,
            stock_out: 180,
            stock_out_value: 3600000000,
            remaining_stock: 20
        }
    ]
}

// Thêm hàm format thời gian
const formatPeriodLabel = (period: string, type: 'weekly' | 'monthly' | 'quarterly' | 'yearly') => {
    switch (type) {
        case 'weekly':
            // Chuyển đổi từ "dd/MM/yyyy - dd/MM/yyyy" thành "Tuần dd/MM - dd/MM/yyyy"
            const [start, end] = period.split(' - ')
            const [startDay, startMonth] = start.split('/')
            const [endDay, endMonth, year] = end.split('/')
            return `Tuần ${startDay}/${startMonth} - ${endDay}/${endMonth}/${year}`
        case 'monthly':
            // Chuyển đổi từ "TM/yyyy" thành "Tháng M/yyyy"
            return period.replace('T', 'Tháng ')
        case 'quarterly':
            // Chuyển đổi từ "QQ/yyyy" thành "Quý Q/yyyy"
            return period.replace('Q', 'Quý ')
        case 'yearly':
            // Thêm "Năm" vào trước năm
            return `Năm ${period}`
        default:
            return period
    }
}

export default function RevenueWarehouse() {
    useSetTitle('Thống kê kho hàng')
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly')
    const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'brand'>('overview')

    // Xử lý dữ liệu theo thời gian được chọn
    const periodData = useMemo(() => {
        const data = mockWarehouseData.stockHistory
        const result: {
            period: string
            stock_in: number
            stock_in_value: number
            stock_out: number
            stock_out_value: number
            remaining_stock: number
        }[] = []

        // Nhóm dữ liệu theo period
        data.forEach((item) => {
            const date = new Date(item.timestamp)
            let periodKey = ''

            switch (selectedPeriod) {
                case 'weekly': {
                    const { start, end } = getDateRangeOfWeek(date)
                    periodKey = `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`
                    break
                }
                case 'monthly':
                    periodKey = getMonthName(date)
                    break
                case 'quarterly':
                    periodKey = `Q${getQuarterFromDate(date)}/${date.getFullYear()}`
                    break
                case 'yearly':
                    periodKey = date.getFullYear().toString()
                    break
            }

            const existingPeriod = result.find((p) => p.period === periodKey)
            if (existingPeriod) {
                existingPeriod.stock_in += item.stock_in
                existingPeriod.stock_in_value += item.stock_in_value
                existingPeriod.stock_out += item.stock_out
                existingPeriod.stock_out_value += item.stock_out_value
                existingPeriod.remaining_stock = item.remaining_stock // Lấy số tồn mới nhất
            } else {
                result.push({
                    period: periodKey,
                    stock_in: item.stock_in,
                    stock_in_value: item.stock_in_value,
                    stock_out: item.stock_out,
                    stock_out_value: item.stock_out_value,
                    remaining_stock: item.remaining_stock
                })
            }
        })

        return result.sort((a, b) => a.period.localeCompare(b.period))
    }, [selectedPeriod])

    // Prepare chart data
    const chartData = useMemo(() => {
        return {
            stockMovement: {
                labels: periodData.map((d) => formatPeriodLabel(d.period, selectedPeriod)),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Nhập kho',
                        data: periodData.map((d) => d.stock_in),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Xuất kho',
                        data: periodData.map((d) => d.stock_out),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: periodData.map((d) => d.remaining_stock),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            stockValue: {
                labels: periodData.map((d) => formatPeriodLabel(d.period, selectedPeriod)),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Giá trị nhập',
                        data: periodData.map((d) => d.stock_in_value),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Giá trị xuất',
                        data: periodData.map((d) => d.stock_out_value),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    }
                ]
            },
            categoryAnalysis: {
                labels: mockWarehouseData.categoryStats.map((c) => c.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng nhập',
                        data: mockWarehouseData.categoryStats.map((c) => c.stock_in),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Số lượng xuất',
                        data: mockWarehouseData.categoryStats.map((c) => c.stock_out),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: mockWarehouseData.categoryStats.map((c) => c.remaining_stock),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y'
                    }
                ]
            },
            categoryValue: {
                labels: mockWarehouseData.categoryStats.map((c) => c.name),
                datasets: [
                    {
                        data: mockWarehouseData.categoryStats.map((c) => c.stock_in_value),
                        backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)']
                    }
                ]
            },
            brandAnalysis: {
                labels: mockWarehouseData.brandStats.map((b) => b.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng nhập',
                        data: mockWarehouseData.brandStats.map((b) => b.stock_in),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Số lượng xuất',
                        data: mockWarehouseData.brandStats.map((b) => b.stock_out),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: mockWarehouseData.brandStats.map((b) => b.remaining_stock),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y'
                    }
                ]
            },
            brandValue: {
                labels: mockWarehouseData.brandStats.map((b) => b.name),
                datasets: [
                    {
                        data: mockWarehouseData.brandStats.map((b) => b.stock_in_value),
                        backgroundColor: [
                            'rgba(53, 162, 235, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(255, 206, 86, 0.5)'
                        ]
                    }
                ]
            }
        }
    }, [periodData, selectedPeriod])

    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'category', label: 'Theo danh mục' },
        { id: 'brand', label: 'Theo thương hiệu' }
    ]

    return (
        <div className='min-h-screen bg-white p-4 pb-20'>
            <div className='max-w-7xl mx-auto'>
                {/* Header và Tabs */}
                <div className='mb-8 space-y-4'>
                    <div className='flex justify-between items-center'>
                        <div className='flex space-x-4'>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className='border rounded-lg px-6 py-2'
                            >
                                <option value='weekly'>Theo tuần</option>
                                <option value='monthly'>Theo tháng</option>
                                <option value='quarterly'>Theo quý</option>
                                <option value='yearly'>Theo năm</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex space-x-4 border-b border-gray-200'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 font-medium border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className='space-y-6'>
                    {activeTab === 'overview' && (
                        <>
                            {/* KPIs */}
                            <div className='grid grid-cols-4 gap-6 mb-6'>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tổng nhập kho</h3>
                                    <p className='text-3xl font-bold text-blue-600'>
                                        {periodData[periodData.length - 1].stock_in.toLocaleString()}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Giá trị: {formatCurrency(periodData[periodData.length - 1].stock_in_value)}
                                    </p>
                                </div>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tổng xuất kho</h3>
                                    <p className='text-3xl font-bold text-green-600'>
                                        {periodData[periodData.length - 1].stock_out.toLocaleString()}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Giá trị: {formatCurrency(periodData[periodData.length - 1].stock_out_value)}
                                    </p>
                                </div>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tồn kho</h3>
                                    <p className='text-3xl font-bold text-yellow-600'>
                                        {periodData[periodData.length - 1].remaining_stock.toLocaleString()}
                                    </p>
                                </div>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tỷ lệ xuất/nhập</h3>
                                    <p className='text-3xl font-bold text-purple-600'>
                                        {(
                                            (periodData[periodData.length - 1].stock_out /
                                                periodData[periodData.length - 1].stock_in) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Giá trị:{' '}
                                        {(
                                            (periodData[periodData.length - 1].stock_out_value /
                                                periodData[periodData.length - 1].stock_in_value) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </div>
                            </div>

                            {/* Biểu đồ chính */}
                            <div className='grid grid-cols-1 gap-6'>
                                <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                    <h3 className='text-[15px] font-semibold mb-4 uppercase'>Biểu đồ biến động số lượng</h3>
                                    <div className='h-80'>
                                        <Bar
                                            data={chartData.stockMovement as ChartData<'bar', number[], string>}
                                            options={{
                                                maintainAspectRatio: false,
                                                interaction: {
                                                    mode: 'index',
                                                    intersect: false
                                                },
                                                scales: {
                                                    x: {
                                                        ticks: {
                                                            maxRotation: 45,
                                                            minRotation: 45
                                                        }
                                                    },
                                                    y: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'left',
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Số lượng nhập/xuất'
                                                        }
                                                    },
                                                    y1: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'right',
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Số lượng tồn'
                                                        },
                                                        grid: {
                                                            drawOnChartArea: false
                                                        }
                                                    }
                                                },
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context) => {
                                                                const label = context.dataset.label || ''
                                                                const value = context.parsed.y
                                                                return `${label}: ${value.toLocaleString()}`
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                    <h3 className='text-[15px] font-semibold mb-4 uppercase'>Biểu đồ biến động giá trị</h3>
                                    <div className='h-80'>
                                        <Bar
                                            data={chartData.stockValue as ChartData<'bar', number[], string>}
                                            options={{
                                                maintainAspectRatio: false,
                                                interaction: {
                                                    mode: 'index',
                                                    intersect: false
                                                },
                                                scales: {
                                                    x: {
                                                        ticks: {
                                                            maxRotation: 45,
                                                            minRotation: 45
                                                        }
                                                    },
                                                    y: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'left',
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Giá trị nhập/xuất'
                                                        },
                                                        ticks: {
                                                            callback: (value) => formatCurrency(value as number)
                                                        }
                                                    },
                                                    y1: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'right',
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Giá trung bình/SP'
                                                        },
                                                        ticks: {
                                                            callback: (value) => formatCurrency(value as number)
                                                        },
                                                        grid: {
                                                            drawOnChartArea: false
                                                        }
                                                    }
                                                },
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context) => {
                                                                const label = context.dataset.label || ''
                                                                const value = context.parsed.y
                                                                return `${label}: ${formatCurrency(value)}`
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'category' && (
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>Phân tích theo danh mục</h3>
                                <div className='h-80'>
                                    <Bar
                                        data={chartData.categoryAnalysis as ChartData<'bar', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>Giá trị nhập theo danh mục</h3>
                                <div className='h-80'>
                                    <Pie
                                        data={chartData.categoryValue as ChartData<'pie', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'right'
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => {
                                                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                                            const percentage = ((context.parsed / total) * 100).toFixed(1)
                                                            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'brand' && (
                        <div className='grid grid-cols-2 gap-6'>
                            <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>Phân tích theo thương hiệu</h3>
                                <div className='h-80'>
                                    <Bar
                                        data={chartData.brandAnalysis as ChartData<'bar', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            interaction: {
                                                mode: 'index',
                                                intersect: false
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>Giá trị nhập theo thương hiệu</h3>
                                <div className='h-80'>
                                    <Pie
                                        data={chartData.brandValue as ChartData<'pie', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'right'
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => {
                                                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                                                            const percentage = ((context.parsed / total) * 100).toFixed(1)
                                                            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
