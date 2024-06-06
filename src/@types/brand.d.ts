import { PaginatedApiResponse } from './util'

interface Brand {
    id: number
    name: string
    slug: string
    summary: string
}

export type BrandResponse = PaginatedApiResponse<Brand>
