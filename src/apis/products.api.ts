import { ProductFilter, ListProductResponse } from '~/@types/product'
import API from '~/constants/api'
import { ProductSchemaType } from '~/schemas/products.schema'
import http from '~/utils/http'

export type CreateProductRequest = ProductSchemaType & {
    description: string
    colors: string[]
    sizes: string[]
}

const productsApi = {
    getAllProducts: (params: ProductFilter) => {
        return http.get<ListProductResponse>(API.PRODUCT, {
            params
        })
    },
    createProduct: (body: CreateProductRequest) => {
        return http.post(API.PRODUCT, body)
    }
}

export default productsApi
