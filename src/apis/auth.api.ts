import { LoginResponse } from '~/@types/auth'
import API from '~/constants/api'
import { AuthSchemaType } from '~/schemas/auth.schema'
import http from '~/utils/http'

type LoginRequest = AuthSchemaType

const authApi = {
    login: (body: LoginRequest) => {
        return http.post<LoginResponse>(API.LOGIN, body)
    }
}

export default authApi
