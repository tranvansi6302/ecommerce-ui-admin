import { ApiResponse, PaginatedApiResponse } from './util'
import { Variant } from './variant'

interface PricePlan {
    id: number
    discount: number
    status: string
    variant: Variant
    sale_price: number
    promotion_price: number
    start_date: string
    end_date: string
}
export interface CreatePricePlan {
    variant_id: number
    sale_price: number
    promotion_price: number | null
    start_date: string | null
    end_date: string | null
}

export interface PricePlanFilter {
    page?: number
    limit?: number
    category?: string
    brand?: string
    search?: string
}

export type CreatePricePlanResponse = ApiResponse<PricePlan>
export type ListPricePlanCurrentResponse = PaginatedApiResponse<PricePlan>
