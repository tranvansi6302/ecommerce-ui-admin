import { PaginatedApiResponse } from './util'

interface BaseVariant {
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
}

interface PricePlan {
    id: number
    discount: number
    status: string
    sale_price: number
    promotion_price: number
    start_date: string
    end_date: string
}

export interface Variant extends BaseVariant {
    map(arg0: (variant: Variant) => import('react/jsx-runtime').JSX.Element): import('react').ReactNode
    current_price_plan: PricePlan
}

export interface VariantWarehouse extends BaseVariant {
    map(arg0: (variant: Variant) => import('react/jsx-runtime').JSX.Element): import('react').ReactNode
    price_plans: PricePlan
}

export type ListVariantResponse = PaginatedApiResponse<Variant>
