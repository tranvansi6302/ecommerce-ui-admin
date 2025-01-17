import { useQuery } from '@tanstack/react-query'
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
import { Bar, Line, Pie } from 'react-chartjs-2'
import renvenueApi from '~/apis/renvenue.api'
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

// Trong phần chart options, thêm kiểu cho các callback
const valueTickCallback = (tickValue: string | number): string => {
    return formatCurrency(Number(tickValue))
}

interface TooltipContext {
    dataset: {
        label?: string
    }
    parsed: {
        y: number
    }
    label?: string
}

const tooltipLabelCallback = (context: TooltipContext): string => {
    const label = context.dataset.label || ''
    const value = context.parsed.y
    return `${label}: ${formatCurrency(value)}`
}

export default function RevenueWarehouse() {
    useSetTitle('Thống kê kho hàng')
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly')
    const [activeTab, setActiveTab] = useState<'overview' | 'category' | 'brand'>('overview')

    // warehouse history
    const { data: warehouseHistory } = useQuery({
        queryKey: ['warehouse-history'],
        queryFn: () => renvenueApi.getWarehouseHistory()
    })

    // warehouse categories
    const { data: warehouseCategories } = useQuery({
        queryKey: ['warehouse-categories'],
        queryFn: () => renvenueApi.getWarehouseCategories()
    })

    // warehouse brands
    const { data: warehouseBrands } = useQuery({
        queryKey: ['warehouse-brands'],
        queryFn: () => renvenueApi.getWarehouseBrands()
    })

    // Xử lý dữ liệu theo thời gian được chọn
    const periodData = useMemo(() => {
        const data = warehouseHistory?.data
        const result: {
            period: string
            stock_in: number
            stock_in_value: number
            remaining_stock: number
        }[] = []

        // Nhóm dữ liệu theo period
        data?.forEach((item) => {
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
                existingPeriod.stock_in += item?.stock_in || 0
                existingPeriod.stock_in_value += item?.stock_in_value || 0
                existingPeriod.remaining_stock = item?.remaining_stock || 0 // Lấy số tồn mới nhất
            } else {
                result.push({
                    period: periodKey,
                    stock_in: item?.stock_in || 0,
                    stock_in_value: item?.stock_in_value || 0,
                    remaining_stock: item?.remaining_stock || 0
                })
            }
        })

        return result.sort((a, b) => a.period.localeCompare(b.period))
    }, [selectedPeriod, warehouseHistory])

    // Prepare chart data
    const chartData = useMemo(() => {
        return {
            stockMovement: {
                labels: periodData.map((d) => formatPeriodLabel(d.period, selectedPeriod)),
                datasets: [
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: periodData.map((d) => d.remaining_stock),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
                    },
                    {
                        type: 'bar',
                        label: 'Số lượng nhập',
                        data: periodData.map((d) => d?.stock_in || 0),
                        backgroundColor: 'rgba(53, 162, 235, 0.8)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    }
                ]
            },
            stockValue: {
                labels: periodData.map((d) => formatPeriodLabel(d.period, selectedPeriod)),
                datasets: [
                    {
                        type: 'line',
                        label: 'Giá trị nhập',
                        data: periodData.map((d) => d?.stock_in_value || 0),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            categoryAnalysis: {
                labels: warehouseCategories?.data.map((c) => c.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng nhập',
                        data: warehouseCategories?.data.map((c) => c?.stock_in || 0),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: warehouseCategories?.data.map((c) => c?.remaining_stock || 0),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Giá trị nhập',
                        data: warehouseCategories?.data.map((c) => c?.stock_in_value || 0),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y1'
                    }
                ]
            },
            categoryValue: {
                labels: warehouseCategories?.data.map((c) => c.name),
                datasets: [
                    {
                        data: warehouseCategories?.data.map((c) => c?.stock_in_value || 0),
                        backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)']
                    }
                ]
            },
            brandAnalysis: {
                labels: warehouseBrands?.data.map((b) => b.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng nhập',
                        data: warehouseBrands?.data.map((b) => b?.stock_in || 0),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tồn kho',
                        data: warehouseBrands?.data.map((b) => b?.remaining_stock || 0),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Giá trị nhập',
                        data: warehouseBrands?.data.map((b) => b?.stock_in_value || 0),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y1'
                    }
                ]
            },
            brandValue: {
                labels: warehouseBrands?.data.map((b) => b.name),
                datasets: [
                    {
                        data: warehouseBrands?.data.map((b) => b?.stock_in_value || 0),
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
                            <div className='grid grid-cols-2 gap-6 mb-6'>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tổng nhập kho</h3>
                                    <p className='text-3xl font-bold text-blue-600'>
                                        {periodData[periodData.length - 1]?.stock_in.toLocaleString() || 0}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Giá trị: {formatCurrency(periodData[periodData.length - 1]?.stock_in_value || 0)}
                                    </p>
                                </div>
                                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                    <h3 className='text-lg font-semibold mb-2 uppercase'>Tồn kho</h3>
                                    <p className='text-3xl font-bold text-yellow-600'>
                                        {periodData[periodData.length - 1]?.remaining_stock.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Biểu đồ chính */}
                            <div className='grid grid-cols-1 gap-6'>
                                <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                    <h3 className='text-[15px] font-semibold mb-4 uppercase'>Biểu đồ biến động theo thời gian</h3>
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
                                                        grid: {
                                                            display: false
                                                        },
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
                                                            text: 'Số lượng nhập'
                                                        },
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)'
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
                                                    },
                                                    legend: {
                                                        position: 'top',
                                                        align: 'end'
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='bg-white p-6 border border-gray-200 rounded-xl'>
                                    <h3 className='text-[15px] font-semibold mb-4 uppercase'>
                                        Biểu đồ giá trị nhập theo thời gian
                                    </h3>
                                    <div className='h-80'>
                                        <Line
                                            data={chartData.stockValue as ChartData<'line', number[], string>}
                                            options={{
                                                maintainAspectRatio: false,
                                                interaction: {
                                                    mode: 'index',
                                                    intersect: false
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        },
                                                        ticks: {
                                                            maxRotation: 45,
                                                            minRotation: 45
                                                        }
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Giá trị nhập'
                                                        },
                                                        ticks: {
                                                            callback: valueTickCallback
                                                        },
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.1)'
                                                        }
                                                    }
                                                },
                                                plugins: {
                                                    tooltip: {
                                                        callbacks: {
                                                            label: tooltipLabelCallback
                                                        }
                                                    },
                                                    legend: {
                                                        position: 'top',
                                                        align: 'end'
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
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'left',
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng'
                                                    }
                                                },
                                                y1: {
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'right',
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Giá trị'
                                                    },
                                                    ticks: {
                                                        callback: valueTickCallback
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
                                                            if (label === 'Giá trị nhập') {
                                                                return `${label}: ${formatCurrency(value)}`
                                                            }
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
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'left',
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng'
                                                    }
                                                },
                                                y1: {
                                                    type: 'linear',
                                                    display: true,
                                                    position: 'right',
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Giá trị'
                                                    },
                                                    ticks: {
                                                        callback: valueTickCallback
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
                                                            if (label === 'Giá trị nhập') {
                                                                return `${label}: ${formatCurrency(value)}`
                                                            }
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
