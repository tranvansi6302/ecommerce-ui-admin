export interface ApiResponse<T> {
    code: number
    message?: string
    result?: T
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
    pagination: Pagination
}

export interface ErrorResponse {
    code: number
    message: string
}

export interface Pagination {
    page: number
    limit: number
    total_page: number
}

export type MessageResponse = ErrorResponse
