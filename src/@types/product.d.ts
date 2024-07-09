import { Brand } from './brand'
import { Category } from './category'
import { ApiResponse, PaginatedApiResponse } from './util'
import { Variant } from './variant'

interface ProductImage {
    id: number
    url: string
}

interface Product {
    id: number
    name: string
    description: string
    sku: string
    sold: number
    brand: Brand
    category: Category
    status: string

    variants: Omit<Variant, 'current_price_plan'>[]
    product_images: ProductImage[]
    average_rating: number
    created_at: string
    updated_at: string
}

interface ProductCreate {
    id: number
    name: string
    description: string
    sku: string
    brand: Brand
    status: string
    category: Category
    variants: Variant[]
    created_at: string
    updated_at: string
}

interface ProductUploadImages {
    id: number
    name: string
    description: string
    sku: string
    brand: Brand
    category: Category
    pending_update: number
    product_images: ProductImage[]
    created_at: string
    updated_at: string
}

export interface ProductFilter {
    page?: number
    limit?: number
    category?: string
    brand?: string
    name?: string
    status?: string
}

export type ListProductResponse = PaginatedApiResponse<Product>
export type CreateProductResponse = ApiResponse<ProductCreate>
export type UploadImagesResponse = ApiResponse<ProductUploadImages>
