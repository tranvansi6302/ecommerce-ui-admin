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
import { Fragment, useMemo, useState } from 'react'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import renvenueApi from '~/apis/renvenue.api'
import useSetTitle from '~/hooks/useSetTitle'
import {
    calculateMarketShare,
    formatCurrency,
    getNumberFromPeriod,
    getYearFromPeriod,
    groupSalesByTimeRange
} from './utils/chart'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

export default function RevenueSale() {
    useSetTitle('Thống kê bán hàng')
    const [timeRangeType, setTimeRangeType] = useState<'week' | 'month' | 'quarter' | 'year'>('week')
    const [productLimit, setProductLimit] = useState<number>(5)
    const [showWorstPerforming, setShowWorstPerforming] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'brands' | 'categories'>('overview')

    // Gọi api lấy dữ liệu renvenue sale
    const { data: renvenueSale } = useQuery({
        queryKey: ['renvenue-sale'],
        queryFn: () => renvenueApi.getSale()
    })

    // Gọi api lấy dữ liệu renvenue products
    const { data: renvenueProducts } = useQuery({
        queryKey: ['renvenue-products'],
        queryFn: () => renvenueApi.getProducts()
    })

    // Gọi api lấy dữ liệu renvenue brands
    const { data: renvenueBrands } = useQuery({
        queryKey: ['renvenue-brands'],
        queryFn: () => renvenueApi.getBrands()
    })

    // Gọi api lấy dữ liệu renvenue categories
    const { data: renvenueCategories } = useQuery({
        queryKey: ['renvenue-categories'],
        queryFn: () => renvenueApi.getCategories()
    })

    const filteredData = useMemo(() => {
        const grouped = groupSalesByTimeRange(renvenueSale?.data || [], timeRangeType)
        return Object.values(grouped).sort((a: any, b: any) => {
            const yearA = getYearFromPeriod(a.period)
            const yearB = getYearFromPeriod(b.period)

            if (yearA !== yearB) return yearA - yearB

            // Nếu cùng năm thì so sánh theo số tuần/tháng/quý
            const numA = getNumberFromPeriod(a.period)
            const numB = getNumberFromPeriod(b.period)
            return numA - numB
        })
    }, [timeRangeType, renvenueSale?.data])

    const filteredProducts = useMemo(() => {
        return [...(renvenueProducts?.data || [])]
            .sort((a, b) => (showWorstPerforming ? a.revenue - b.revenue : b.revenue - a.revenue))
            .slice(0, productLimit)
    }, [productLimit, showWorstPerforming, renvenueProducts?.data])

    const totals = useMemo(
        () => ({
            revenue: filteredData.reduce((sum, item: any) => sum + item.revenue, 0),
            quantity: filteredData.reduce((sum, item: any) => sum + item.quantity, 0),
            profit: filteredData.reduce((sum, item: any) => sum + item.profit, 0),
            order_quantity: filteredData.reduce((sum, item: any) => sum + item.order_quantity, 0)
        }),
        [filteredData]
    )

    // Thêm loading state

    // Kiểm tra dữ liệu trước khi render
    const isDataReady = renvenueSale?.data && renvenueProducts?.data

    const chartData = useMemo(() => {
        if (!isDataReady || !renvenueBrands?.data || !renvenueProducts?.data || !renvenueCategories?.data) {
            return
        }

        return {
            products: {
                labels: filteredProducts?.map((p) => p.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng bán',
                        data: filteredProducts.map((p) => p.quantity_sale),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Doanh thu (triệu )',
                        data: filteredProducts.map((p) => p.revenue / 1000000),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        yAxisID: 'y1'
                    }
                ]
            },
            brands: {
                overview: {
                    labels: renvenueBrands?.data.map((b) => b.name),
                    datasets: [
                        {
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                },
                details: {
                    labels: renvenueBrands?.data.map((b) => b.name),
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Số lượng bán',
                            data: renvenueBrands?.data.map((b) => b.quantity_sale),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            yAxisID: 'y'
                        },
                        {
                            type: 'line',
                            label: 'Doanh thu',
                            data: renvenueBrands?.data.map((b) => b.revenue),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            yAxisID: 'y1'
                        }
                    ]
                },
                quantityShare: {
                    labels: renvenueBrands?.data.map((b) => b.name),
                    datasets: [
                        {
                            data: calculateMarketShare(renvenueBrands?.data, 'quantity').map((b) => b.value),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                },
                revenueShare: {
                    labels: renvenueBrands?.data.map((b) => b.name),
                    datasets: [
                        {
                            data: calculateMarketShare(renvenueBrands?.data, 'revenue').map((b) => b.value),
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 99, 132, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                }
            },
            categories: {
                overview: {
                    labels: renvenueCategories?.data.map((c) => c.name),
                    datasets: [
                        {
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 99, 132, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                },
                details: {
                    labels: renvenueCategories?.data.map((c) => c.name),
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Số lượng bán',
                            data: renvenueCategories?.data.map((c) => c.quantity_sale),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            yAxisID: 'y'
                        },
                        {
                            type: 'line',
                            label: 'Doanh thu',
                            data: renvenueCategories?.data.map((c) => c.revenue),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            yAxisID: 'y1'
                        }
                    ]
                },
                quantityShare: {
                    labels: renvenueCategories?.data.map((c) => c.name),
                    datasets: [
                        {
                            data: calculateMarketShare(renvenueCategories?.data, 'quantity').map((c) => c.value),
                            backgroundColor: [
                                'rgba(255, 159, 64, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 99, 132, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                },
                revenueShare: {
                    labels: renvenueCategories?.data.map((c) => c.name),
                    datasets: [
                        {
                            data: calculateMarketShare(renvenueCategories?.data, 'revenue').map((c) => c.value),
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(255, 159, 64, 0.8)'
                            ],
                            borderColor: 'white',
                            borderWidth: 2
                        }
                    ]
                }
            },
            ratings: {
                labels: (renvenueProducts?.data || [])
                    .filter((p) => p.rating && p.review_count)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 5)
                    .map((p) => p.name),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Số lượng đánh giá',
                        data: (renvenueProducts?.data || [])
                            .filter((p) => p.rating && p.review_count)
                            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            .slice(0, 5)
                            .map((p) => p.review_count),
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Đánh giá trung bình',
                        data: (renvenueProducts?.data || [])
                            .filter((p) => p.rating && p.review_count)
                            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                            .slice(0, 5)
                            .map((p) => p.rating),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y1'
                    }
                ]
            }
        }
    }, [isDataReady, filteredProducts, renvenueCategories?.data])

    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'products', label: 'Sản phẩm' },
        { id: 'brands', label: 'Thương hiệu' },
        { id: 'categories', label: 'Danh mục' }
    ]

    return (
        <div className='min-h-screen bg-white p-4'>
            <div className='max-w-7xl mx-auto'>
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

                {activeTab === 'overview' && (
                    <>
                        {!isDataReady ? (
                            <div className='flex justify-center items-center h-64'>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <>
                                <div className='grid grid-cols-4 gap-6 mb-6'>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Doanh thu</h3>
                                        <p className='text-3xl font-bold text-blue-600'>{formatCurrency(totals.revenue)}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Số lượng bán</h3>
                                        <p className='text-3xl font-bold text-green-600'>{totals.quantity.toLocaleString()}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Lợi nhuận</h3>
                                        <p className='text-3xl font-bold text-yellow-600'>{formatCurrency(totals.profit)}</p>
                                    </div>
                                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                        <h3 className='text-lg font-semibold mb-2'>Đơn hàng</h3>
                                        <p className='text-3xl font-bold text-purple-600'>
                                            {totals.order_quantity.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-6 mb-8'>
                                    <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>
                                            Doanh thu theo thời gian (triệu )
                                        </h3>
                                        <div className='h-80'>
                                            <Line
                                                data={{
                                                    labels: filteredData.map((d: any) => d.period),
                                                    datasets: [
                                                        {
                                                            label: 'Doanh thu',
                                                            data: filteredData.map((d: any) => d.revenue),
                                                            borderColor: 'rgb(53, 162, 235)',
                                                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                                            tension: 0.3,
                                                            fill: true
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) =>
                                                                    `Doanh thu: ${formatCurrency(context.parsed.y)} `
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            title: {
                                                                display: true,
                                                                text: ''
                                                            },
                                                            ticks: {
                                                                callback: function (value: any) {
                                                                    return formatCurrency(value) + ' '
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>
                                            Lợi nhuận theo thời gian (triệu )
                                        </h3>
                                        <div className='h-80'>
                                            <Line
                                                data={{
                                                    labels: filteredData.map((d: any) => d.period),
                                                    datasets: [
                                                        {
                                                            label: 'Lợi nhuận',
                                                            data: filteredData.map((d: any) => d.profit),
                                                            borderColor: 'rgb(75, 192, 192)',
                                                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                                            tension: 0.3,
                                                            fill: true
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) =>
                                                                    `Lợi nhuận: ${formatCurrency(context.parsed.y)}`
                                                            }
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            title: {
                                                                display: true,
                                                                text: ''
                                                            },
                                                            ticks: {
                                                                callback: function (value: any) {
                                                                    return formatCurrency(value)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 gap-6'>
                                    <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>Top 5 sản phẩm bán chạy</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: (renvenueProducts?.data || [])
                                                        .sort((a, b) => b.quantity_sale - a.quantity_sale)
                                                        .slice(0, 5)
                                                        .map((p) => p.name),
                                                    datasets: [
                                                        {
                                                            label: 'Số lượng bán',
                                                            data: (renvenueProducts?.data || [])
                                                                .sort((a, b) => b.quantity_sale - a.quantity_sale)
                                                                .slice(0, 5)
                                                                .map((p) => p.quantity_sale),
                                                            backgroundColor: 'rgba(53, 162, 235, 0.5)'
                                                        },
                                                        {
                                                            label: 'Doanh thu (triệu )',
                                                            data: (renvenueProducts?.data || [])
                                                                .sort((a, b) => b.quantity_sale - a.quantity_sale)
                                                                .slice(0, 5)
                                                                .map((p) => p.revenue / 1000000),
                                                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => {
                                                                    if (context.dataset.label === 'Số lượng bán') {
                                                                        return `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                                    }
                                                                    return `Doanh thu: ${context.parsed.y.toFixed(0)} triệu `
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>Top 5 sản phẩm bán chậm</h3>
                                        <div className='h-80'>
                                            <Bar
                                                data={{
                                                    labels: (renvenueProducts?.data || [])
                                                        .sort((a, b) => a.quantity_sale - b.quantity_sale)
                                                        .slice(0, 5)
                                                        .map((p) => p.name),
                                                    datasets: [
                                                        {
                                                            label: 'Số lượng bán',
                                                            data: (renvenueProducts?.data || [])
                                                                .sort((a, b) => a.quantity_sale - b.quantity_sale)
                                                                .slice(0, 5)
                                                                .map((p) => p.quantity_sale),
                                                            backgroundColor: 'rgba(255, 99, 132, 0.5)'
                                                        },
                                                        {
                                                            label: 'Doanh thu (triệu )',
                                                            data: (renvenueProducts?.data || [])
                                                                .sort((a, b) => a.quantity_sale - b.quantity_sale)
                                                                .slice(0, 5)
                                                                .map((p) => p.revenue / 1000000),
                                                            backgroundColor: 'rgba(255, 159, 64, 0.5)'
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) => {
                                                                    if (context.dataset.label === 'Số lượng bán') {
                                                                        return `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                                    }
                                                                    return `Doanh thu: ${context.parsed.y.toFixed(0)} triệu `
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div> */}
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'products' && (
                    <>
                        <div className='flex space-x-4 mb-6'>
                            <select
                                value={productLimit}
                                onChange={(e) => setProductLimit(Number(e.target.value))}
                                className='border rounded-lg px-4 py-2'
                            >
                                <option value={3}>Top 3</option>
                                <option value={5}>Top 5</option>
                                <option value={10}>Top 10</option>
                            </select>

                            <label className='flex items-center space-x-2'>
                                <input
                                    type='checkbox'
                                    checked={showWorstPerforming}
                                    onChange={(e) => setShowWorstPerforming(e.target.checked)}
                                    className='form-checkbox'
                                />
                                <span>Hiển thị sản phẩm kém</span>
                            </label>
                        </div>

                        <div className='grid grid-cols-2 gap-6 mb-8'>
                            <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>
                                    {showWorstPerforming ? 'Sản phẩm bán chậm' : 'Top sản phẩm bán chạy'}
                                </h3>
                                <div className='h-80'>
                                    <Bar
                                        data={chartData?.products as ChartData<'bar', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    type: 'linear',
                                                    position: 'left',
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng bán'
                                                    }
                                                },
                                                y1: {
                                                    type: 'linear',
                                                    position: 'right',
                                                    title: {
                                                        display: true,
                                                        text: 'Doanh thu (triệu )'
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
                                                            if (context.dataset.label === 'Số lượng bán') {
                                                                return `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                            }
                                                            return `Doanh thu: ${context.parsed.y.toFixed(0)} triệu `
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                <h3 className='text-[15px] font-semibold mb-4 uppercase'>Top sản phẩm được đánh giá cao</h3>
                                <div className='h-80'>
                                    <Bar
                                        data={chartData?.ratings as ChartData<'bar', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    type: 'linear',
                                                    position: 'left',
                                                    title: {
                                                        display: true,
                                                        text: 'Số lượng đánh giá'
                                                    }
                                                },
                                                y1: {
                                                    type: 'linear',
                                                    position: 'right',
                                                    title: {
                                                        display: true,
                                                        text: 'Đánh giá trung bình (sao)'
                                                    },
                                                    min: 0,
                                                    max: 5,
                                                    grid: {
                                                        drawOnChartArea: false
                                                    }
                                                }
                                            },
                                            plugins: {
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => {
                                                            if (context.dataset.label === 'Số lượng đánh giá') {
                                                                return `Số lượng đánh giá: ${context.parsed.y.toLocaleString()}`
                                                            }
                                                            return `Đánh giá: ${context.parsed.y.toFixed(1)} sao`
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                            <h3 className='text-[15px] font-semibold mb-4 uppercase'>Chi tiết sản phẩm</h3>
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
                                                Doanh thu
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                                Số lượng
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className='px-6 py-4 whitespace-nowrap'>{product.name}</td>
                                                <td className='px-6 py-4 whitespace-nowrap'>{product.category}</td>
                                                <td className='px-6 py-4 whitespace-nowrap'>{formatCurrency(product.revenue)}</td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {product.quantity_sale.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'brands' && (
                    <>
                        {!isDataReady || !chartData?.brands ? (
                            <div className='flex justify-center items-center h-64'>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <Fragment>
                                <div className='grid grid-cols-2 gap-6 mb-8'>
                                    <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>Thị phần theo số lượng bán</h3>
                                        <div className='h-80'>
                                            <Doughnut
                                                data={chartData.brands.quantityShare}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: { position: 'right' },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) =>
                                                                    `${context.label}: ${context.parsed}% (${renvenueBrands?.data[context.dataIndex].quantity_sale.toLocaleString()} sản phẩm)`
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                        <h3 className='text-[15px] font-semibold mb-4 uppercase'>Thị phần theo doanh thu</h3>
                                        <div className='h-80'>
                                            <Doughnut
                                                data={chartData.brands.revenueShare}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: { position: 'right' },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (context) =>
                                                                    `${context.label}: ${context.parsed}% (${formatCurrency(renvenueBrands?.data[context.dataIndex]?.revenue || 0)})`
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-white p-6 border border-gray-200 rounded-lg'>
                                    <h3 className='text-[15px] font-semibold mb-4 uppercase'>Phân tích chi tiết</h3>
                                    <div className='h-80'>
                                        <Bar
                                            data={chartData?.brands.details as unknown as ChartData<'bar', number[], string>}
                                            options={{
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        type: 'linear',
                                                        position: 'left',
                                                        title: {
                                                            display: true,
                                                            text: 'Số lượng bán'
                                                        },
                                                        ticks: {
                                                            callback: function (value) {
                                                                return value.toLocaleString()
                                                            }
                                                        }
                                                    },
                                                    y1: {
                                                        type: 'linear',
                                                        position: 'right',
                                                        title: {
                                                            display: true,
                                                            text: 'Doanh thu'
                                                        },
                                                        ticks: {
                                                            callback: function (value: any) {
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
                                                            label: (context) => {
                                                                if (context.dataset.label === 'Số lượng bán') {
                                                                    return `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                                }
                                                                return `Doanh thu: ${formatCurrency(context.parsed.y)}`
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </>
                )}

                {activeTab === 'categories' && (
                    <>
                        <div className='grid grid-cols-2 gap-6 mb-8'>
                            <div className='bg-white p-6'>
                                <h3 className='text-lg font-semibold mb-4'>Thị phần theo số lượng bán</h3>
                                <div className='h-80'>
                                    <Pie
                                        data={
                                            chartData?.categories.quantityShare as unknown as ChartData<'pie', number[], string>
                                        }
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'right' },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) =>
                                                            `${context.label}: ${context.parsed}% (${renvenueCategories?.data[context.dataIndex].quantity_sale.toLocaleString()} sản phẩm)`
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='bg-white p-6'>
                                <h3 className='text-lg font-semibold mb-4'>Thị phần theo doanh thu</h3>
                                <div className='h-80'>
                                    <Pie
                                        data={chartData?.categories.revenueShare as unknown as ChartData<'pie', number[], string>}
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'right' },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) =>
                                                            `${context.label}: ${context.parsed}% (${formatCurrency(renvenueCategories?.data[context.dataIndex].revenue || 0)})`
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='bg-white p-6'>
                            <h3 className='text-lg font-semibold mb-4'>Phân tích chi tiết</h3>
                            <div className='h-80'>
                                <Bar
                                    data={chartData?.categories.details as unknown as ChartData<'bar', number[], string>}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                type: 'linear',
                                                position: 'left',
                                                title: {
                                                    display: true,
                                                    text: 'Số lượng bán'
                                                },
                                                ticks: {
                                                    callback: function (value) {
                                                        return value.toLocaleString()
                                                    }
                                                }
                                            },
                                            y1: {
                                                type: 'linear',
                                                position: 'right',
                                                title: {
                                                    display: true,
                                                    text: 'Doanh thu'
                                                },
                                                ticks: {
                                                    callback: function (value: any) {
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
                                                    label: (context) => {
                                                        if (context.dataset.label === 'Số lượng bán') {
                                                            return `Số lượng: ${context.parsed.y.toLocaleString()}`
                                                        }
                                                        return `Doanh thu: ${formatCurrency(context.parsed.y)}`
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
