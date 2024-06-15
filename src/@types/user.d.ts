import { Role } from './role'
import { PaginatedApiResponse } from './util'

export interface User {
    id: number
    full_name: string
    avatar: string
    email: string
    date_of_birth: string
    phone_number: string
    roles: Role[]
    status: string
    created_at: string
    updated_at: string
}

export interface UserStatus {
    id: number
    status: string
}

export interface UserFilter {
    page?: number
    limit?: number
    status?: string
    email?: string
}

export type ListUserResponse = PaginatedApiResponse<User>
