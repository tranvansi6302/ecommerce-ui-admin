import { LoginResponse } from '~/@types/auth'
import API from '~/constants/api'
import { ProductSchemaType } from '~/schemas/products.schema'
import http from '~/utils/http'

export type CreateProductRequest = ProductSchemaType & {
    description: string
    colors: string[]
    sizes: string[]
}

const productsApi = {
    login: (body: CreateProductRequest) => {
        return http.post<LoginResponse>(API.CREATE_PRODUCT, body)
    }
}

export default productsApi
