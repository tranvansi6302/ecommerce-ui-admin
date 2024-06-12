import { PaginatedApiResponse } from './util'

interface Variant {
    map(arg0: (variant: Variant) => import('react/jsx-runtime').JSX.Element): import('react').ReactNode
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

export type ListVariantResponse = PaginatedApiResponse<Variant>
