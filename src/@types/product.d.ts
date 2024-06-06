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
}

export type ProductResponse = PaginatedApiResponse<Product>
