import {
    CreateProductResponse,
    ListProductResponse,
    ListProductSaleResponse,
    ProductFilter,
    ProductResponse,
    ProductSaleFilters,
    UpdateProductResponse,
    UploadImagesResponse
} from '~/@types/product'
import { MessageResponse } from '~/@types/util'
import API from '~/constants/api'
import { ProductSchemaType } from '~/schemas/products.schema'
import http from '~/utils/http'

export type CreateUpdateProductRequest = ProductSchemaType & {
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
    getProductById: (id: number) => {
        return http.get<ProductResponse>(`${API.PRODUCT}/${id}`)
    },
    createProduct: (body: CreateUpdateProductRequest) => {
        return http.post<CreateProductResponse>(API.PRODUCT, body)
    },

    updateProduct: (id: number, body: CreateUpdateProductRequest) => {
        return http.patch<UpdateProductResponse>(`${API.PRODUCT}/${id}`, body)
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
    },
    updateManyStatusProducts: (data: { product_ids: number[] }) => {
        return http.patch<MessageResponse>(`${API.PRODUCT}/status`, data)
    },
    getAllProductSale: (params: ProductSaleFilters) => {
        return http.get<ListProductSaleResponse>(`${API.PRODUCT}/sales`, {
            params
        })
    },

    deleteProductImages: (body: { product_id: number }) => {
        return http.delete<MessageResponse>(`${API.PRODUCT}/images`, {
            data: body
        })
    }
}

export default productsApi
