import { ApiResponse } from './util'

interface PricePlan {
    id: number
    discount: number
    status: string
    variant: Omit<Variant, 'current_price_plan'>
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

export type CreatePricePlanResponse = ApiResponse<PricePlan>
