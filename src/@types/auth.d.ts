import { User } from './user'
import { ApiResponse } from './util'

export type LoginResponse = ApiResponse<{
    token: string
    user: User
}>
