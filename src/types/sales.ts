export interface SaleTransaction {
    id: string
    date: string
    productId: string
    productName: string
    category: string
    quantity: number
    unitPrice: number
    totalAmount: number
    customerId: string
    customerName: string
    paymentMethod: 'cash' | 'card' | 'transfer' | 'cod'
    status: 'completed' | 'pending' | 'cancelled'
    profit: number
}

export interface Order {
    id: string
    date: string
    customerId: string
    customerName: string
    products: {
        productId: string
        productName: string
        quantity: number
        unitPrice: number
        totalAmount: number
    }[]
    totalAmount: number
    status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
    paymentStatus: 'pending' | 'paid' | 'refunded'
    paymentMethod: 'cash' | 'card' | 'transfer' | 'cod'
    shippingAddress: string
    shippingFee: number
}

export interface ProductPerformance {
    productId: string
    productName: string
    category: string
    totalSold: number
    totalRevenue: number
    totalProfit: number
    averageRating: number
    stockLevel: number
    reorderPoint: number
    returnRate: number
}

export interface CustomerSegment {
    segment: 'new' | 'regular' | 'vip' | 'inactive'
    customerCount: number
    totalRevenue: number
    averageOrderValue: number
    retentionRate: number
}
