import { PaginatedApiResponse } from './util'

interface Brand {
    find(arg0: (b: any) => boolean): Brand | null
    id: number
    name: string
    slug: string
    summary: string
}

export type ListBrandResponse = PaginatedApiResponse<Brand>
export type CreateBrandResponse = ApiResponse<Brand>
export type UpdateBrandResponse = ApiResponse<Brand>
export type BrandResponse = ApiResponse<Brand>
