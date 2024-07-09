import { CreateProductResponse, ListProductResponse, ProductFilter, UploadImagesResponse } from '~/@types/product'
import { MessageResponse } from '~/@types/util'
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
        return http.post<CreateProductResponse>(API.PRODUCT, body)
    },
    uploadImages: (id: number, body: FormData) => {
        return http.patch<UploadImagesResponse>(`${API.PRODUCT}/${id}/upload-images`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    deleteManyProducts: (body: { product_ids: number[] }) => {
        return http.delete<MessageResponse>(API.PRODUCT, {
            data: body
        })
    }
}

export default productsApi
