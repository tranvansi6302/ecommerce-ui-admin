import { PaginatedApiResponse } from './util'

interface Category {
    find(arg0: (c: any) => boolean): Category | null
    id: number
    name: string
    slug: string
    summary: string
    created_at: string
    updated_at: string
}

export type CategoryResponse = PaginatedApiResponse<Category>
