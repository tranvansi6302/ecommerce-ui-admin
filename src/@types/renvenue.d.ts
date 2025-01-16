export interface RenvenueSale {
    id: number
    revenue: number
    order_quantity: number
    profit: number
    quantity: number
    timestamp: string
}

export interface RenvenueProducts {
    id: number
    name: string
    category: string
    brand: string
    revenue: number
    rating: number
    product_id: number
    quantity_sale: number
    review_count: number
}

export interface RenvenueBrands {
    id: number
    name: string
    revenue: number
    brand_id: number
    quantity_sale: number
}

export interface RenvenueCategories {
    id: number
    name: string
    revenue: number
    category_id: number
    quantity_sale: number
}
