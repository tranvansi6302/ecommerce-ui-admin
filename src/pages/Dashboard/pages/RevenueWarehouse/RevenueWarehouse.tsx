import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import useSetTitle from '~/hooks/useSetTitle'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

export default function RevenueWarehouse() {
    useSetTitle('Thống kê kho bán hàng')
    const [selectedTab, setSelectedTab] = useState<string>('stockInOut')
    const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'quarter' | 'year'>('week')

    // Thêm state cho các thống kê tổng quan
    const [summaryStats, setSummaryStats] = useState({
        totalStockValue: 0,
        outOfStockItems: 0,
        lowStockItems: 0,
        topSellingItems: [],
        stockTurnoverRate: 0
    })

    // Hàm format ngày tháng
    const formatDate = (dateStr: string, type: 'week' | 'month' | 'quarter' | 'year') => {
        const date = new Date(dateStr)
        switch (type) {
            case 'week':
                const weekNumber = Math.ceil((date.getDate() + 6 - date.getDay()) / 7)
                return `Tuần ${weekNumber}, Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
            case 'month':
                return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
            case 'quarter':
                const quarter = Math.floor(date.getMonth() / 3) + 1
                return `Quý ${quarter}/${date.getFullYear()}`
            case 'year':
                return date.getFullYear().toString()
            default:
                return dateStr
        }
    }

    // Dữ liệu mẫu đầy đủ cho cả năm
    const fullMockData = {
        stockInOut: [
            // Tuần 1
            {
                date: '2025-01-01',
                stockIn: 250,
                stockOut: 180,
                stockInValue: 25000000,
                stockOutValue: 18000000,
                topCategories: ['Điện tử', 'Thời trang']
            },
            {
                date: '2025-01-02',
                stockIn: 180,
                stockOut: 150,
                stockInValue: 20000000,
                stockOutValue: 15000000,
                topCategories: ['Mỹ phẩm', 'Điện tử']
            },
            {
                date: '2025-01-03',
                stockIn: 300,
                stockOut: 280,
                stockInValue: 35000000,
                stockOutValue: 32000000,
                topCategories: ['Thực phẩm', 'Đồ gia dụng']
            },
            {
                date: '2025-01-04',
                stockIn: 220,
                stockOut: 200,
                stockInValue: 28000000,
                stockOutValue: 25000000,
                topCategories: ['Thời trang', 'Mỹ phẩm']
            },
            {
                date: '2025-01-05',
                stockIn: 280,
                stockOut: 250,
                stockInValue: 32000000,
                stockOutValue: 28000000,
                topCategories: ['Điện tử', 'Thực phẩm']
            },
            {
                date: '2025-01-06',
                stockIn: 350,
                stockOut: 320,
                stockInValue: 40000000,
                stockOutValue: 36000000,
                topCategories: ['Đồ gia dụng', 'Điện tử']
            },
            {
                date: '2025-01-07',
                stockIn: 200,
                stockOut: 180,
                stockInValue: 22000000,
                stockOutValue: 20000000,
                topCategories: ['Thời trang', 'Mỹ phẩm']
            },
            // Tuần 2
            {
                date: '2025-01-08',
                stockIn: 280,
                stockOut: 260,
                stockInValue: 30000000,
                stockOutValue: 28000000,
                topCategories: ['Điện tử', 'Thực phẩm']
            }
            // ... thêm dữ liệu cho các tuần tiếp theo
        ],
        currentStock: {
            Q1: [
                {
                    category: 'Điện tử',
                    brand: 'Samsung',
                    stock: 500,
                    value: 250000000,
                    minStockLevel: 100,
                    maxStockLevel: 1000,
                    turnoverRate: 2.5,
                    lastRestockDate: '2025-01-01',
                    status: 'Đủ hàng',
                    location: 'Kho A - Kệ 1'
                },
                {
                    category: 'Điện tử',
                    brand: 'Apple',
                    stock: 300,
                    value: 450000000,
                    minStockLevel: 50,
                    maxStockLevel: 500,
                    turnoverRate: 3.0,
                    lastRestockDate: '2025-01-03',
                    status: 'Đủ hàng',
                    location: 'Kho A - Kệ 2'
                },
                {
                    category: 'Thời trang',
                    brand: 'Uniqlo',
                    stock: 800,
                    value: 160000000,
                    minStockLevel: 200,
                    maxStockLevel: 1500,
                    turnoverRate: 4.0,
                    lastRestockDate: '2025-01-02',
                    status: 'Đủ hàng',
                    location: 'Kho B - Kệ 1'
                },
                {
                    category: 'Mỹ phẩm',
                    brand: 'Innisfree',
                    stock: 50,
                    value: 25000000,
                    minStockLevel: 100,
                    maxStockLevel: 800,
                    turnoverRate: 5.0,
                    lastRestockDate: '2025-01-01',
                    status: 'Sắp hết hàng',
                    location: 'Kho C - Kệ 1'
                },
                {
                    category: 'Thực phẩm',
                    brand: 'Vinamilk',
                    stock: 1200,
                    value: 180000000,
                    minStockLevel: 300,
                    maxStockLevel: 2000,
                    turnoverRate: 6.0,
                    lastRestockDate: '2025-01-04',
                    status: 'Đủ hàng',
                    location: 'Kho D - Kệ 1'
                }
            ],
            Q2: [
                // Tương tự như Q1 nhưng với số liệu khác
            ],
            Q3: [
                // Tương tự như Q1 nhưng với số liệu khác
            ],
            Q4: [
                // Tương tự như Q1 nhưng với số liệu khác
            ]
        },
        stockCost: {
            weekly: [
                {
                    week: 'Tuần 1/2025',
                    cost: 50000000,
                    breakdown: {
                        storage: 30000000,
                        labor: 15000000,
                        utilities: 5000000,
                        maintenance: 8000000,
                        insurance: 2000000,
                        other: 1000000
                    },
                    metrics: {
                        costPerUnit: 25000,
                        utilizationRate: 85,
                        efficiency: 92
                    }
                }
                // Thêm dữ liệu cho các tuần khác
            ],
            monthly: [
                {
                    month: 'Tháng 1/2025',
                    cost: 200000000,
                    breakdown: {
                        storage: 120000000,
                        labor: 60000000,
                        utilities: 20000000,
                        maintenance: 32000000,
                        insurance: 8000000,
                        other: 4000000
                    },
                    metrics: {
                        costPerUnit: 23000,
                        utilizationRate: 88,
                        efficiency: 94
                    }
                }
                // Thêm dữ liệu cho các tháng khác
            ],
            quarterly: [
                {
                    quarter: 'Quý 1/2025',
                    cost: 600000000,
                    breakdown: {
                        storage: 360000000,
                        labor: 180000000,
                        utilities: 60000000,
                        maintenance: 96000000,
                        insurance: 24000000,
                        other: 12000000
                    },
                    metrics: {
                        costPerUnit: 22000,
                        utilizationRate: 90,
                        efficiency: 95
                    }
                }
                // Thêm dữ liệu cho các quý khác
            ],
            yearly: [
                {
                    year: '2025',
                    cost: 2400000000,
                    breakdown: {
                        storage: 1440000000,
                        labor: 720000000,
                        utilities: 240000000,
                        maintenance: 384000000,
                        insurance: 96000000,
                        other: 48000000
                    },
                    metrics: {
                        costPerUnit: 21000,
                        utilizationRate: 92,
                        efficiency: 96
                    }
                }
            ]
        }
    }

    // Cập nhật summaryStats khi component mount
    useEffect(() => {
        // Tính toán các chỉ số tổng quan
        const currentStockData = fullMockData.currentStock.Q1
        const totalValue = currentStockData.reduce((sum, item) => sum + item.value, 0)
        const outOfStock = currentStockData.filter((item) => item.stock === 0).length
        const lowStock = currentStockData.filter((item) => item.stock < item.minStockLevel).length
        const avgTurnover = currentStockData.reduce((sum, item) => sum + item.turnoverRate, 0) / currentStockData.length

        setSummaryStats({
            totalStockValue: totalValue,
            outOfStockItems: outOfStock,
            lowStockItems: lowStock,
            topSellingItems: [],
            stockTurnoverRate: Number(avgTurnover.toFixed(2))
        })
    }, [])

    // Hàm lọc dữ liệu theo khoảng thời gian
    const getFilteredData = () => {
        const currentDate = new Date('2025-01-01') // Giả sử ngày hiện tại
        let filteredData = { ...fullMockData }

        switch (timeFrame) {
            case 'week':
                // Lọc dữ liệu trong 7 ngày gần nhất
                filteredData.stockInOut = fullMockData.stockInOut.filter((item) => {
                    const itemDate = new Date(item.date)
                    const diffTime = Math.abs(currentDate.getTime() - itemDate.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return diffDays <= 7
                })
                break
            case 'month':
                // Lọc dữ liệu trong tháng hiện tại
                filteredData.stockInOut = fullMockData.stockInOut.filter((item) => {
                    const itemDate = new Date(item.date)
                    return itemDate.getMonth() === currentDate.getMonth()
                })
                break
            case 'quarter':
                // Lọc dữ liệu theo quý hiện tại
                const currentQuarter = Math.floor(currentDate.getMonth() / 3)
                filteredData.currentStock = fullMockData.currentStock[`Q${currentQuarter + 1}`]
                break
            case 'year':
                // Sử dụng toàn bộ dữ liệu của năm
                break
        }

        return filteredData
    }

    // Cập nhật hàm getChartData
    const getChartData = () => {
        const filteredData = getFilteredData()

        switch (selectedTab) {
            case 'stockInOut':
                return {
                    labels: filteredData.stockInOut.map((d) => formatDate(d.date, timeFrame)),
                    datasets: [
                        {
                            type: 'line',
                            label: 'Nhập kho',
                            data: filteredData.stockInOut.map((d) => d.stockIn),
                            borderColor: 'rgba(54, 162, 235, 1)',
                            tension: 0.1
                        },
                        {
                            type: 'line',
                            label: 'Xuất kho',
                            data: filteredData.stockInOut.map((d) => d.stockOut),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            tension: 0.1
                        }
                    ]
                }
            case 'currentStock':
                const stockData = Array.isArray(filteredData.currentStock)
                    ? filteredData.currentStock
                    : filteredData.currentStock.Q1
                return {
                    labels: stockData.map((d) => `${d.category} - ${d.brand}\n(Tồn: ${d.stock})`),
                    datasets: [
                        {
                            label: 'Giá trị tồn kho (VNĐ)',
                            data: stockData.map((d) => d.value),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)'
                            ]
                        }
                    ]
                }
            case 'stockCost':
                const costData =
                    filteredData.stockCost[
                        timeFrame === 'week'
                            ? 'weekly'
                            : timeFrame === 'month'
                              ? 'monthly'
                              : timeFrame === 'quarter'
                                ? 'quarterly'
                                : 'yearly'
                    ]
                return {
                    labels: costData.map((d) => d.week || d.month || d.quarter || d.year),
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Chi phí lưu kho',
                            data: costData.map((d) => d.breakdown.storage),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)'
                        },
                        {
                            type: 'bar',
                            label: 'Chi phí nhân công',
                            data: costData.map((d) => d.breakdown.labor),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)'
                        },
                        {
                            type: 'bar',
                            label: 'Chi phí tiện ích',
                            data: costData.map((d) => d.breakdown.utilities),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)'
                        },
                        {
                            type: 'line',
                            label: 'Tổng chi phí',
                            data: costData.map((d) => d.cost),
                            borderColor: 'rgba(153, 102, 255, 1)',
                            fill: false
                        }
                    ]
                }
            default:
                return {
                    labels: [],
                    datasets: []
                }
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: `Thống kê kho hàng (${
                    selectedTab === 'stockInOut'
                        ? 'Nhập/Xuất kho'
                        : selectedTab === 'currentStock'
                          ? 'Tồn kho hiện tại'
                          : 'Chi phí kho'
                })`
            }
        }
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Bảng điều khiển kho hàng</h1>

            {/* Thống kê tổng quan */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <h3 className='text-lg font-semibold'>Tổng giá trị tồn kho</h3>
                    <p className='text-2xl text-blue-600'>{summaryStats.totalStockValue.toLocaleString()} VNĐ</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <h3 className='text-lg font-semibold'>Sản phẩm hết hàng</h3>
                    <p className='text-2xl text-red-600'>{summaryStats.outOfStockItems}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <h3 className='text-lg font-semibold'>Sản phẩm sắp hết</h3>
                    <p className='text-2xl text-yellow-600'>{summaryStats.lowStockItems}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <h3 className='text-lg font-semibold'>Tỷ lệ luân chuyển</h3>
                    <p className='text-2xl text-green-600'>{summaryStats.stockTurnoverRate}x</p>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex space-x-4 mb-6'>
                <button
                    onClick={() => setSelectedTab('stockInOut')}
                    className={`px-4 py-2 border rounded ${
                        selectedTab === 'stockInOut' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Nhập/Xuất kho
                </button>
                <button
                    onClick={() => setSelectedTab('currentStock')}
                    className={`px-4 py-2 border rounded ${
                        selectedTab === 'currentStock' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Tồn kho hiện tại
                </button>
                <button
                    onClick={() => setSelectedTab('stockCost')}
                    className={`px-4 py-2 border rounded ${
                        selectedTab === 'stockCost' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    Chi phí kho
                </button>
            </div>

            {/* Bộ lọc thời gian */}
            <div className='mb-4'>
                <label className='mr-2'>Khoảng thời gian:</label>
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
                    className='border rounded p-2'
                >
                    <option value='week'>Theo tuần</option>
                    <option value='month'>Theo tháng</option>
                    <option value='quarter'>Theo quý</option>
                    <option value='year'>Theo năm</option>
                </select>
            </div>

            {/* Biểu đồ */}
            {selectedTab === 'currentStock' ? (
                <Pie data={getChartData()} options={options} />
            ) : (
                <Bar data={getChartData()} options={options} />
            )}
        </div>
    )
}
