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

interface ProductCreateUpdate {
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

export type ProductSaleType = {
    id: number
    brand: Brand
    category: Category
    description: string
    images: ProductImage[]
    sku: string
    variants: Variant[]
    product_id: number
    product_name: string
    total_sold: number
    average_rating: number
    total_reviews: number
    min_price: number
    created_at: string
    updated_at: string
}

export type ProductSaleFilters = {
    page?: number
    limit?: number
    category?: string
    brand?: string
    search?: string
}

export type ListProductResponse = PaginatedApiResponse<Product>
export type ProductResponse = ApiResponse<Product>
export type CreateProductResponse = ApiResponse<ProductCreateUpdate>
export type UpdateProductResponse = ApiResponse<ProductCreateUpdate>
export type UploadImagesResponse = ApiResponse<ProductUploadImages>
export type ListProductSaleResponse = PaginatedApiResponse<ProductSale>
