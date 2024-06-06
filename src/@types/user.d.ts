import { Role } from './role'

export interface User {
    id: number
    full_name: string
    avatar: string
    email: string
    date_of_birth: string
    phone_number: string
    roles: Role[]
    status: string
}
