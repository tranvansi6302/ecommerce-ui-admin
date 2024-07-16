import { User } from './user'
import { ApiResponse } from './util'

export interface AuthType {
    token: string
    user: User
}

export type LoginResponse = ApiResponse<AuthType>
