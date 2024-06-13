import { PaginatedApiResponse } from './util'
import { Variant } from './variant'

interface Warehouse {
    id: number
    sku: string
    variant: Omit<Variant, 'current_price_plan'>
    total_quantity: number
    available_quantity: number
    last_updated: string
}

export interface WarehouseFilter {
    page?: number
    limit?: number
    category?: string
    brand?: string
    search?: string
}

export type ListWarehouseResponse = PaginatedApiResponse<Warehouse>
