export interface SalesData {
    date: string
    revenue: number
    orders: number
    customers: number
    averageOrderValue: number
    profit: number
}

export interface ProductData {
    id: string
    name: string
    category: string
    brand: string
    sales: {
        quantity: number
        revenue: number
        profit: number
    }[]
    rating: number
    reviews: number
    returnRate: number
}

export interface CategoryData {
    name: string
    totalSales: number
    totalRevenue: number
    totalProfit: number
    growth: number
    brands: string[]
}

export interface CustomerSegment {
    count: number
    revenue: number
    averageOrderValue: number
    retentionRate: number
}
