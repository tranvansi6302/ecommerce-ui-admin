interface Variant {
    id: number
    sku: string
    color: string
    size: string
    warehouse: {
        id: number
        available_quantity: number
        purchase_price: number
    }
    variant_name: string
    product_name: string
    current_price_plan: {
        id: number
        discount: number
        status: string
        sale_price: number
        promotion_price: number
        start_date: string
        end_date: string
    }
}
