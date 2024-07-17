import { Role } from './role'
import { ApiResponse, PaginatedApiResponse } from './util'

export interface User {
    id: number
    full_name: string
    avatar: string
    email: string
    date_of_birth: string
    phone_number: string
    roles: Role[]
    status: string
    is_deleted: number
    deleted_at: string
    created_at: string
    updated_at: string
}

export interface UserStatus {
    id: number
    status: string
    db?: string
}

export interface UserFilter {
    page?: number
    limit?: number
    status?: string
    email?: string
    is_deleted?: number
}

interface Address {
    id: number
    province: string
    district: string
    ward: string
    description: string
    full_name: string
    phone_number: string
    is_default: number
    province_id: number
    district_id: number
    ward_id: string
}

export interface Profile extends User {
    address: Address[]
}

export type ListUserResponse = PaginatedApiResponse<User>
export type UserResponse = ApiResponse<User>
export type UpdateUserResponse = ApiResponse<User>
