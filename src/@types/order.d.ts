import { Profile } from './user'
import { ApiResponse, PaginatedApiResponse } from './util'
import { Variant } from './variant'

export interface Order {
    id: number
    address: string
    note: string
    status: string
    user: Profile
    phone_number: string
    canceled_date: string
    canceled_reason: string
    confirmed_date: string
    delivered_date: string
    delivering_date: string
    pending_date: string
    order_code: string
    tracking_code: string
    order_date: string
    payment_method: string
    discount_order: number
    discount_shipping: number
    paid_date: string
    shipping_fee: number
    online_payment_status: string
    order_details: OrderDetail[]
}

interface OrderDetail {
    price: number
    quantity: number
    current_price_plans: PricePlan
    variant: Variant & {
        product_images: ProductImage[]
    }
}

export type OrderFilters = {
    page?: number
    limit?: number
    status?: string
    search?: string
}

export type ListOrderResponse = PaginatedApiResponse<Order>
export type OrderResponse = ApiResponse<Order>
export type UpdateOrderResponse = ApiResponse<Order>
