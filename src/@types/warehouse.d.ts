import { ApiResponse, PaginatedApiResponse } from './util'
import { VariantWarehouse } from './variant'

interface Warehouse {
    map(arg0: (warehouse: Warehouse) => import('react/jsx-runtime').JSX.Element): import('react').ReactNode
    id: number
    sku: string
    variant: VariantWarehouse
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
export type WarehouseResponse = ApiResponse<Warehouse>
