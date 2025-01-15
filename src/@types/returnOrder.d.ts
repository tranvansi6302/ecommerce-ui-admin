import { Variant } from './variant'

export type ReturnOrderResponse = {
    id: number
    price: number
    order_detail: null
    old_variant_id: number
    product_name: string
    order_code: string
    created_at: string
    variant_id: number
    return_reason: string
    old_price: number
    return_status: string
    variant: Variant
    old_variant: Variant
}

export type ReturnOrderFilter = {
    page?: number
    limit?: number
    status?: string
    search?: string
}
export type ReturnOrderResponse = ApiResponse<ReturnOrderResponse>
export type ReturnOrderListResponse = PaginatedApiResponse<ReturnOrderResponse>
