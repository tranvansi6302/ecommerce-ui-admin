import { Supplier } from './supplier'
import { ApiResponse } from './util'
import { Variant } from './variant'

interface PurchaseOrder {
    id: number
    note: string
    purchase_order_date: string
    status: string
    supplier: Supplier
    purchase_order_code: string
    purchase_details: [
        {
            quantity: number
            variant: Omit<Variant, 'current_price_plan'>
            purchase_price: number
            quantity_received: number
        }
    ]
}

export type CreatePurchaseResponse = ApiResponse<PurchaseOrder>
