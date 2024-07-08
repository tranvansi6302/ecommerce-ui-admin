import { ApiResponse, PaginatedApiResponse } from './util'

export interface Supplier {
    find(arg0: (supplier: { id: number }) => boolean): Supplier | null
    id: number
    name: string
    email: string
    address: string
    status: string
    tax_code: string
    phone_number: string
}

export interface SupplierStatus {
    id: string
    status: string
}

export interface SupplierFilter {
    search?: string
    status?: string
    page?: string
    limit?: string
}

export type CreateSupplierResponse = ApiResponse<Supplier>
export type UpdateSupplierResponse = ApiResponse<Supplier>
export type ListSupplierResponse = PaginatedApiResponse<Supplier>
export type SupplierResponse = ApiResponse<Supplier>
