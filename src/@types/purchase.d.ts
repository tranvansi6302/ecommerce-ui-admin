import { Supplier } from './supplier'
import { ApiResponse, PaginatedApiResponse } from './util'
import { Variant } from './variant'

interface PurchaseOrder {
    id: number
    note: string
    purchase_order_date: string
    status: string
    supplier: Supplier
    purchase_order_code: string
    purchase_details: PurchaseDetails[]
}

export interface PurchaseDetails {
    quantity: number
    variant: Omit<Variant, 'current_price_plan'>
    purchase_price: number
    quantity_received: number
    note: string
}

export interface PurchaseOrderStatus {
    id: string
    status: string
}

export interface PurchaseOrderFilter {
    page?: number
    limit?: number
    search?: string
    supplier?: number
    status?: string
}

export type CreatePurchaseResponse = ApiResponse<PurchaseOrder>
export type UpdatePurchaseResponse = ApiResponse<PurchaseOrder>
export type ListPurchaseResponse = PaginatedApiResponse<PurchaseOrder>
export type PurchaseResponse = ApiResponse<PurchaseOrder>
