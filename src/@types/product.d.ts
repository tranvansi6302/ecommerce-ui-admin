import { Brand } from './brand'
import { Category } from './category'
import { PaginatedApiResponse } from './util'

interface Product {
    id: number
    name: string
    description: string
    sku: string
    sold: number
    brand: Brand
    category: Category
    variants: Variant[]
    average_rating: number
    created_at: string
    updated_at: string
}

export interface ProductFilter {
    page?: number
    limit?: number
    category?: string
    brand?: string
    name?: string
}

export type ListProductResponse = PaginatedApiResponse<Product>
