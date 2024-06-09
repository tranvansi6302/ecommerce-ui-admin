import { PaginatedApiResponse } from './util'

interface Brand {
    find(arg0: (b: any) => boolean): Brand | null
    id: number
    name: string
    slug: string
    summary: string
}

export type BrandResponse = PaginatedApiResponse<Brand>
