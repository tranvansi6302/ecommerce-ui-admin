import { ApiResponse } from './util'

interface Category {
    id: number
    name: string
    slug: string
    summary: string
}

export type CategoryResponse = ApiResponse<Category>
