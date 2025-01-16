import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrency } from '../RevenueSale/utils/chart'

const mockData = {
    stock: [
        {
            id: 'P1',
            name: 'iPhone 15 Pro Max',
            category: 'Điện thoại',
            brand: 'Apple',
            quantity: 50,
            minQuantity: 10,
            value: 1500000000,
            location: 'Kho A'
        },
        {
            id: 'P2',
            name: 'Samsung S24 Ultra',
            category: 'Điện thoại',
            brand: 'Samsung',
            quantity: 8,
            minQuantity: 10,
            value: 800000000,
            location: 'Kho A'
        },
        {
            id: 'P3',
            name: 'Xiaomi 14 Pro',
            category: 'Điện thoại',
            brand: 'Xiaomi',
            quantity: 15,
            minQuantity: 8,
            value: 450000000,
            location: 'Kho A'
        },
        {
            id: 'P4',
            name: 'MacBook Pro M3',
            category: 'Laptop',
            brand: 'Apple',
            quantity: 25,
            minQuantity: 5,
            value: 1200000000,
            location: 'Kho B'
        },
        {
            id: 'P5',
            name: 'Dell XPS 13',
            category: 'Laptop',
            brand: 'Dell',
            quantity: 4,
            minQuantity: 5,
            value: 400000000,
            location: 'Kho B'
        },
        {
            id: 'P6',
            name: 'iPad Pro',
            category: 'Máy tính bảng',
            brand: 'Apple',
            quantity: 30,
            minQuantity: 8,
            value: 900000000,
            location: 'Kho C'
        }
    ],
    history: [
        {
            date: '2024-03-01',
            stockIn: 100,
            stockOut: 80,
            stockInValue: 3000000000,
            stockOutValue: 2400000000
        },
        {
            date: '2024-03-02',
            stockIn: 150,
            stockOut: 120,
            stockInValue: 4500000000,
            stockOutValue: 3600000000
        },
        {
            date: '2024-03-03',
            stockIn: 80,
            stockOut: 95,
            stockInValue: 2400000000,
            stockOutValue: 2850000000
        },
        {
            date: '2024-03-04',
            stockIn: 120,
            stockOut: 100,
            stockInValue: 3600000000,
            stockOutValue: 3000000000
        },
        {
            date: '2024-03-05',
            stockIn: 90,
            stockOut: 85,
            stockInValue: 2700000000,
            stockOutValue: 2550000000
        }
    ],
    cost: [
        {
            period: 'T1/2024',
            storageCost: 150000000,
            operatingCost: 100000000,
            maintenanceCost: 50000000,
            utilitiesCost: 30000000,
            total: 330000000
        },
        {
            period: 'T2/2024',
            storageCost: 160000000,
            operatingCost: 110000000,
            maintenanceCost: 45000000,
            utilitiesCost: 35000000,
            total: 350000000
        },
        {
            period: 'T3/2024',
            storageCost: 155000000,
            operatingCost: 105000000,
            maintenanceCost: 48000000,
            utilitiesCost: 32000000,
            total: 340000000
        }
    ],
    summary: {
        byCategory: [
            {
                name: 'Điện thoại',
                totalQuantity: 73,
                totalValue: 2750000000,
                stockInRate: 0.45,
                stockOutRate: 0.42
            },
            {
                name: 'Laptop',
                totalQuantity: 29,
                totalValue: 1600000000,
                stockInRate: 0.35,
                stockOutRate: 0.38
            },
            {
                name: 'Máy tính bảng',
                totalQuantity: 30,
                totalValue: 900000000,
                stockInRate: 0.2,
                stockOutRate: 0.2
            }
        ],
        byBrand: [
            {
                name: 'Apple',
                totalQuantity: 105,
                totalValue: 3600000000,
                stockInRate: 0.4,
                stockOutRate: 0.38
            },
            {
                name: 'Samsung',
                totalQuantity: 8,
                totalValue: 800000000,
                stockInRate: 0.25,
                stockOutRate: 0.27
            },
            {
                name: 'Xiaomi',
                totalQuantity: 15,
                totalValue: 450000000,
                stockInRate: 0.2,
                stockOutRate: 0.22
            },
            {
                name: 'Dell',
                totalQuantity: 4,
                totalValue: 400000000,
                stockInRate: 0.15,
                stockOutRate: 0.13
            }
        ]
    }
}

export default function RevenueWarehouse() {
    useSetTitle('Thống kê kho hàng')
    const [timeRangeType, setTimeRangeType] = useState<'week' | 'month' | 'quarter' | 'year'>('week')
    const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'cost'>('overview')

    // Thay thế các useQuery bằng dữ liệu mock
    const { data: warehouseStock } = useQuery({
        queryKey: ['warehouse-stock'],
        queryFn: () => Promise.resolve({ data: mockData.stock })
    })

    const { data: warehouseCost } = useQuery({
        queryKey: ['warehouse-cost'],
        queryFn: () => Promise.resolve({ data: mockData.cost })
    })

    const { data: warehouseHistory } = useQuery({
        queryKey: ['warehouse-history'],
        queryFn: () => Promise.resolve({ data: mockData.history })
    })

    // Tính toán tổng quan
    const totals = useMemo(
        () => ({
            totalStock: warehouseStock?.data?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
            totalValue: warehouseStock?.data?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
            totalCost: warehouseCost?.data?.reduce((sum: number, item: any) => sum + item.total, 0) || 0,
            outOfStock: warehouseStock?.data?.filter((item: any) => item.quantity <= item.minQuantity).length || 0
        }),
        [warehouseStock?.data, warehouseCost?.data]
    )

    // Kiểm tra dữ liệu
    const isDataReady = warehouseStock?.data && warehouseCost?.data && warehouseHistory?.data

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = useMemo(() => {
        if (!isDataReady) return {}

        return {
            stockFlow: {
                labels: warehouseHistory?.data.map((d: any) => d.date),
                datasets: [
                    {
                        label: 'Nhập kho',
                        data: warehouseHistory?.data.map((d: any) => d.stockIn),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Xuất kho',
                        data: warehouseHistory?.data.map((d: any) => d.stockOut),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y'
                    }
                ]
            },
            stockValue: {
                labels: warehouseStock?.data.map((d: any) => d.category),
                datasets: [
                    {
                        data: warehouseStock?.data.map((d: any) => d.value),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ]
                    }
                ]
            },
            costAnalysis: {
                labels: warehouseCost?.data.map((d: any) => d.period),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Chi phí lưu kho',
                        data: warehouseCost?.data.map((d: any) => d.storageCost),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'Chi phí vận hành',
                        data: warehouseCost?.data.map((d: any) => d.operatingCost),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Tổng chi phí',
                        data: warehouseCost?.data.map((d: any) => d.total),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y1'
                    }
                ]
            }
        }
    }, [isDataReady, warehouseStock?.data, warehouseCost?.data, warehouseHistory?.data])

    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'stock', label: 'Tồn kho' },
        { id: 'cost', label: 'Chi phí' }
    ]

    return (
        <div className='min-h-screen bg-gray-100 p-4'>
            <div className='max-w-7xl mx-auto'>
                {/* Header và Tabs */}
                <div className='mb-8 space-y-4'>
                    <div className='flex justify-between items-center'>
                        <div className='flex space-x-4'>
                            <select
                                value={timeRangeType}
                                onChange={(e) => setTimeRangeType(e.target.value as any)}
                                className='border rounded-lg px-6 py-2'
                            >
                                <option value='week'>Theo tuần</option>
                                <option value='month'>Theo tháng</option>
                                <option value='quarter'>Theo quý</option>
                                <option value='year'>Theo năm</option>
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
                {!isDataReady ? (
                    <div className='flex justify-center items-center h-64'>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                {/* Thống kê tổng quan */}
                                <div className='grid grid-cols-4 gap-6 mb-6'>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Tổng tồn kho</h3>
                                        <p className='text-3xl font-bold text-blue-600'>{totals.totalStock.toLocaleString()}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Giá trị tồn kho</h3>
                                        <p className='text-3xl font-bold text-green-600'>{formatCurrency(totals.totalValue)}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Chi phí kho</h3>
                                        <p className='text-3xl font-bold text-yellow-600'>{formatCurrency(totals.totalCost)}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Sắp hết hàng</h3>
                                        <p className='text-3xl font-bold text-red-600'>{totals.outOfStock}</p>
                                    </div>
                                </div>

                                {/* Biểu đồ nhập xuất kho */}
                                <div className='bg-white p-6 rounded-xl shadow-lg mb-8'>
                                    <h3 className='text-lg font-semibold mb-4'>Biến động nhập xuất kho</h3>
                                    <div className='h-80'>
                                        <Line
                                            data={chartData.stockFlow}
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

                                {/* Thống kê theo danh mục */}
                                <div className='grid grid-cols-2 gap-6 mb-8'>
                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Thống kê theo danh mục</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: mockData.summary.byCategory.map((c) => c.name),
                                                    datasets: [
                                                        {
                                                            label: 'Tỷ lệ nhập kho',
                                                            data: mockData.summary.byCategory.map((c) => c.stockInRate * 100),
                                                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                                            yAxisID: 'y'
                                                        },
                                                        {
                                                            label: 'Tỷ lệ xuất kho',
                                                            data: mockData.summary.byCategory.map((c) => c.stockOutRate * 100),
                                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                                            yAxisID: 'y'
                                                        },
                                                        {
                                                            type: 'line',
                                                            label: 'Giá trị tồn kho',
                                                            data: mockData.summary.byCategory.map((c) => c.totalValue),
                                                            borderColor: 'rgb(255, 99, 132)',
                                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                            yAxisID: 'y1'
                                                        }
                                                    ]
                                                }}
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
                                                            title: {
                                                                display: true,
                                                                text: 'Tỷ lệ (%)'
                                                            },
                                                            min: 0,
                                                            max: 100
                                                        },
                                                        y1: {
                                                            type: 'linear',
                                                            display: true,
                                                            position: 'right',
                                                            title: {
                                                                display: true,
                                                                text: 'Giá trị'
                                                            },
                                                            ticks: {
                                                                callback: function (value) {
                                                                    return formatCurrency(value)
                                                                }
                                                            },
                                                            grid: {
                                                                drawOnChartArea: false
                                                            }
                                                        }
                                                    },
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (context) {
                                                                    if (context.dataset.yAxisID === 'y1') {
                                                                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                                                                    }
                                                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Thống kê theo thương hiệu */}
                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Thống kê theo thương hiệu</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: mockData.summary.byBrand.map((b) => b.name),
                                                    datasets: [
                                                        {
                                                            label: 'Tỷ lệ nhập kho',
                                                            data: mockData.summary.byBrand.map((b) => b.stockInRate * 100),
                                                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                                            yAxisID: 'y'
                                                        },
                                                        {
                                                            label: 'Tỷ lệ xuất kho',
                                                            data: mockData.summary.byBrand.map((b) => b.stockOutRate * 100),
                                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                                            yAxisID: 'y'
                                                        },
                                                        {
                                                            type: 'line',
                                                            label: 'Giá trị tồn kho',
                                                            data: mockData.summary.byBrand.map((b) => b.totalValue),
                                                            borderColor: 'rgb(255, 99, 132)',
                                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                            yAxisID: 'y1'
                                                        }
                                                    ]
                                                }}
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
                                                            title: {
                                                                display: true,
                                                                text: 'Tỷ lệ (%)'
                                                            },
                                                            min: 0,
                                                            max: 100
                                                        },
                                                        y1: {
                                                            type: 'linear',
                                                            display: true,
                                                            position: 'right',
                                                            title: {
                                                                display: true,
                                                                text: 'Giá trị'
                                                            },
                                                            ticks: {
                                                                callback: function (value) {
                                                                    return formatCurrency(value)
                                                                }
                                                            },
                                                            grid: {
                                                                drawOnChartArea: false
                                                            }
                                                        }
                                                    },
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (context) {
                                                                    if (context.dataset.yAxisID === 'y1') {
                                                                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                                                                    }
                                                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
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

                        {activeTab === 'stock' && (
                            <div className='space-y-6'>
                                {/* Top sản phẩm tồn kho */}
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Top sản phẩm theo giá trị tồn kho</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: warehouseStock?.data
                                                        .sort((a, b) => b.value - a.value)
                                                        .slice(0, 5)
                                                        .map((item) => item.name),
                                                    datasets: [
                                                        {
                                                            label: 'Giá trị tồn kho',
                                                            data: warehouseStock?.data
                                                                .sort((a, b) => b.value - a.value)
                                                                .slice(0, 5)
                                                                .map((item) => item.value),
                                                            backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => `Giá trị: ${formatCurrency(context.parsed.y)}`
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                callback: (value) => formatCurrency(value)
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Top sản phẩm theo số lượng tồn kho</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: warehouseStock?.data
                                                        .sort((a, b) => b.quantity - a.quantity)
                                                        .slice(0, 5)
                                                        .map((item) => item.name),
                                                    datasets: [
                                                        {
                                                            label: 'Số lượng tồn kho',
                                                            data: warehouseStock?.data
                                                                .sort((a, b) => b.quantity - a.quantity)
                                                                .slice(0, 5)
                                                                .map((item) => item.quantity),
                                                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) =>
                                                                    `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                callback: (value) => value.toLocaleString()
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bảng chi tiết */}
                                <div className='bg-white p-6 rounded-xl shadow-lg'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h3 className='text-lg font-semibold'>Chi tiết tồn kho</h3>
                                        <div className='flex space-x-2'>
                                            <button className='px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100'>
                                                Xuất Excel
                                            </button>
                                            <button className='px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100'>
                                                Lọc dữ liệu
                                            </button>
                                        </div>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='min-w-full divide-y divide-gray-200'>
                                            <thead className='bg-gray-50'>
                                                <tr>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Sản phẩm
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Danh mục
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Thương hiệu
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Số lượng
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Giá trị
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Vị trí
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                        Trạng thái
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className='bg-white divide-y divide-gray-200'>
                                                {warehouseStock?.data.map((item) => (
                                                    <tr key={item.id} className='hover:bg-gray-50'>
                                                        <td className='px-6 py-4 whitespace-nowrap'>{item.name}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>{item.category}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>{item.brand}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className='flex items-center'>
                                                                <span className='mr-2'>{item.quantity.toLocaleString()}</span>
                                                                {item.quantity <= item.minQuantity && (
                                                                    <span className='text-red-500'>
                                                                        <svg
                                                                            className='w-5 h-5'
                                                                            fill='currentColor'
                                                                            viewBox='0 0 20 20'
                                                                        >
                                                                            <path
                                                                                fillRule='evenodd'
                                                                                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                                                                                clipRule='evenodd'
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            {formatCurrency(item.value)}
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>{item.location}</td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <span
                                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    item.quantity <= item.minQuantity
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}
                                                            >
                                                                {item.quantity <= item.minQuantity ? 'Sắp hết hàng' : 'Đủ hàng'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Phân tích tồn kho chi tiết */}
                                <div className='space-y-6'>
                                    {/* Phân tích theo danh mục */}
                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Phân tích theo danh mục</h3>
                                        <div className='grid grid-cols-2 gap-6'>
                                            <div className='h-80'>
                                                <Pie
                                                    data={{
                                                        labels: [...new Set(warehouseStock?.data.map((item) => item.category))],
                                                        datasets: [
                                                            {
                                                                data: [
                                                                    ...new Set(warehouseStock?.data.map((item) => item.category))
                                                                ].map((category) => {
                                                                    const categoryItems = warehouseStock?.data.filter(
                                                                        (item) => item.category === category
                                                                    )
                                                                    return {
                                                                        value: categoryItems.reduce(
                                                                            (sum, item) => sum + item.value,
                                                                            0
                                                                        ),
                                                                        quantity: categoryItems.reduce(
                                                                            (sum, item) => sum + item.quantity,
                                                                            0
                                                                        ),
                                                                        stockIn: categoryItems.reduce(
                                                                            (sum, item) => sum + (item.stockIn || 0),
                                                                            0
                                                                        ),
                                                                        stockOut: categoryItems.reduce(
                                                                            (sum, item) => sum + (item.stockOut || 0),
                                                                            0
                                                                        )
                                                                    }
                                                                }),
                                                                backgroundColor: [
                                                                    'rgba(255, 99, 132, 0.8)',
                                                                    'rgba(54, 162, 235, 0.8)',
                                                                    'rgba(255, 206, 86, 0.8)'
                                                                ]
                                                            }
                                                        ]
                                                    }}
                                                    options={{
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: (context) => {
                                                                        const datapoint = context.dataset.data[
                                                                            context.dataIndex
                                                                        ] as any
                                                                        const total = context.dataset.data.reduce(
                                                                            (a: any, b: any) => a + b.quantity,
                                                                            0
                                                                        )
                                                                        const percentage = (
                                                                            (datapoint.quantity / total) *
                                                                            100
                                                                        ).toFixed(1)
                                                                        return [
                                                                            `Tổng số lượng: ${datapoint.quantity.toLocaleString()} (${percentage}%)`,
                                                                            `Giá trị: ${formatCurrency(datapoint.value)}`,
                                                                            `Nhập kho: ${datapoint.stockIn.toLocaleString()}`,
                                                                            `Xuất kho: ${datapoint.stockOut.toLocaleString()}`,
                                                                            `Tồn kho: ${(datapoint.stockIn - datapoint.stockOut).toLocaleString()}`
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='space-y-4'>
                                                {[...new Set(warehouseStock?.data.map((item) => item.category))].map(
                                                    (category) => {
                                                        const categoryItems = warehouseStock?.data.filter(
                                                            (item) => item.category === category
                                                        )
                                                        const totalQuantity = categoryItems.reduce(
                                                            (sum, item) => sum + item.quantity,
                                                            0
                                                        )
                                                        const totalValue = categoryItems.reduce(
                                                            (sum, item) => sum + item.value,
                                                            0
                                                        )
                                                        const stockIn = categoryItems.reduce(
                                                            (sum, item) => sum + (item.stockIn || 0),
                                                            0
                                                        )
                                                        const stockOut = categoryItems.reduce(
                                                            (sum, item) => sum + (item.stockOut || 0),
                                                            0
                                                        )

                                                        return (
                                                            <div key={category} className='bg-gray-50 p-4 rounded-lg'>
                                                                <div className='flex justify-between items-start mb-2'>
                                                                    <h4 className='font-medium text-lg'>{category}</h4>
                                                                    <span className='text-sm text-gray-500'>
                                                                        {categoryItems.length} sản phẩm
                                                                    </span>
                                                                </div>
                                                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                                                    <div>
                                                                        <div className='text-gray-600'>Tổng số lượng:</div>
                                                                        <div className='font-medium'>
                                                                            {totalQuantity.toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='text-gray-600'>Giá trị:</div>
                                                                        <div className='font-medium'>
                                                                            {formatCurrency(totalValue)}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='text-gray-600'>Nhập kho:</div>
                                                                        <div className='font-medium'>
                                                                            {stockIn.toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='text-gray-600'>Xuất kho:</div>
                                                                        <div className='font-medium'>
                                                                            {stockOut.toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='text-gray-600'>Tồn kho thực tế:</div>
                                                                        <div className='font-medium'>
                                                                            {(stockIn - stockOut).toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='text-gray-600'>Chênh lệch:</div>
                                                                        <div className='font-medium'>
                                                                            {(
                                                                                totalQuantity -
                                                                                (stockIn - stockOut)
                                                                            ).toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phân tích theo thương hiệu */}
                                    <div className='bg-white p-6 rounded-xl shadow-lg'>
                                        <h3 className='text-lg font-semibold mb-4'>Phân tích theo thương hiệu</h3>
                                        <div className='grid grid-cols-2 gap-6'>
                                            <div className='h-80'>
                                                <Pie
                                                    data={{
                                                        labels: [...new Set(warehouseStock?.data.map((item) => item.brand))],
                                                        datasets: [
                                                            {
                                                                data: [
                                                                    ...new Set(warehouseStock?.data.map((item) => item.brand))
                                                                ].map((brand) => {
                                                                    const brandItems = warehouseStock?.data.filter(
                                                                        (item) => item.brand === brand
                                                                    )
                                                                    return {
                                                                        value: brandItems.reduce(
                                                                            (sum, item) => sum + item.value,
                                                                            0
                                                                        ),
                                                                        quantity: brandItems.reduce(
                                                                            (sum, item) => sum + item.quantity,
                                                                            0
                                                                        ),
                                                                        stockIn: brandItems.reduce(
                                                                            (sum, item) => sum + (item.stockIn || 0),
                                                                            0
                                                                        ),
                                                                        stockOut: brandItems.reduce(
                                                                            (sum, item) => sum + (item.stockOut || 0),
                                                                            0
                                                                        )
                                                                    }
                                                                }),
                                                                backgroundColor: [
                                                                    'rgba(255, 99, 132, 0.8)',
                                                                    'rgba(54, 162, 235, 0.8)',
                                                                    'rgba(255, 206, 86, 0.8)',
                                                                    'rgba(75, 192, 192, 0.8)'
                                                                ]
                                                            }
                                                        ]
                                                    }}
                                                    options={{
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            tooltip: {
                                                                callbacks: {
                                                                    label: (context) => {
                                                                        const datapoint = context.dataset.data[
                                                                            context.dataIndex
                                                                        ] as any
                                                                        const total = context.dataset.data.reduce(
                                                                            (a: any, b: any) => a + b.quantity,
                                                                            0
                                                                        )
                                                                        const percentage = (
                                                                            (datapoint.quantity / total) *
                                                                            100
                                                                        ).toFixed(1)
                                                                        return [
                                                                            `Tổng số lượng: ${datapoint.quantity.toLocaleString()} (${percentage}%)`,
                                                                            `Giá trị: ${formatCurrency(datapoint.value)}`,
                                                                            `Nhập kho: ${datapoint.stockIn.toLocaleString()}`,
                                                                            `Xuất kho: ${datapoint.stockOut.toLocaleString()}`,
                                                                            `Tồn kho: ${(datapoint.stockIn - datapoint.stockOut).toLocaleString()}`
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='space-y-4'>
                                                {[...new Set(warehouseStock?.data.map((item) => item.brand))].map((brand) => {
                                                    const brandItems = warehouseStock?.data.filter((item) => item.brand === brand)
                                                    const totalQuantity = brandItems.reduce((sum, item) => sum + item.quantity, 0)
                                                    const totalValue = brandItems.reduce((sum, item) => sum + item.value, 0)
                                                    const stockIn = brandItems.reduce((sum, item) => sum + (item.stockIn || 0), 0)
                                                    const stockOut = brandItems.reduce(
                                                        (sum, item) => sum + (item.stockOut || 0),
                                                        0
                                                    )

                                                    return (
                                                        <div key={brand} className='bg-gray-50 p-4 rounded-lg'>
                                                            <div className='flex justify-between items-start mb-2'>
                                                                <h4 className='font-medium text-lg'>{brand}</h4>
                                                                <span className='text-sm text-gray-500'>
                                                                    {brandItems.length} sản phẩm
                                                                </span>
                                                            </div>
                                                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                                                <div>
                                                                    <div className='text-gray-600'>Tổng số lượng:</div>
                                                                    <div className='font-medium'>
                                                                        {totalQuantity.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className='text-gray-600'>Giá trị:</div>
                                                                    <div className='font-medium'>
                                                                        {formatCurrency(totalValue)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className='text-gray-600'>Nhập kho:</div>
                                                                    <div className='font-medium'>{stockIn.toLocaleString()}</div>
                                                                </div>
                                                                <div>
                                                                    <div className='text-gray-600'>Xuất kho:</div>
                                                                    <div className='font-medium'>{stockOut.toLocaleString()}</div>
                                                                </div>
                                                                <div>
                                                                    <div className='text-gray-600'>Tồn kho thực tế:</div>
                                                                    <div className='font-medium'>
                                                                        {(stockIn - stockOut).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className='text-gray-600'>Chênh lệch:</div>
                                                                    <div className='font-medium'>
                                                                        {(totalQuantity - (stockIn - stockOut)).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cost' && (
                            <div className='grid grid-cols-1 gap-6'>
                                <div className='bg-white p-6 rounded-xl shadow-lg'>
                                    <h3 className='text-lg font-semibold mb-4'>Chi phí theo thời gian</h3>
                                    <div className='h-80'>
                                        <Line
                                            data={chartData.costAnalysis}
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
                                                        title: {
                                                            display: true,
                                                            text: 'Chi phí'
                                                        },
                                                        ticks: {
                                                            callback: function (value) {
                                                                return formatCurrency(value)
                                                            }
                                                        }
                                                    },
                                                    y1: {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'right',
                                                        title: {
                                                            display: true,
                                                            text: 'Tổng chi phí'
                                                        },
                                                        ticks: {
                                                            callback: function (value) {
                                                                return formatCurrency(value)
                                                            }
                                                        },
                                                        grid: {
                                                            drawOnChartArea: false
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
