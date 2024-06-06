import { ProductResponse } from '~/@types/product'
import API from '~/constants/api'
import { ProductSchemaType } from '~/schemas/products.schema'
import http from '~/utils/http'

export type CreateProductRequest = ProductSchemaType & {
    description: string
    colors: string[]
    sizes: string[]
}

const productsApi = {
    getAllProducts: () => {
        return http.get<ProductResponse>(API.PRODUCT)
    }
}

export default productsApi
