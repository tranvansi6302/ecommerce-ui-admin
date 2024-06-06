import { ApiResponse } from './util'

interface Brand {
    id: number
    name: string
    slug: string
    summary: string
}

export type BrandResponse = ApiResponse<Brand>
