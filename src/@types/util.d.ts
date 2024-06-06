export interface ApiResponse<T> {
    code: number
    message?: string
    result: T
}

export interface ErrorResponse {
    code: number
    message: string
}

export type MessageResponse = ErrorResponse
