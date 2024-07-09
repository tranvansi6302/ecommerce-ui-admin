import { ListBrandResponse, CreateBrandResponse, BrandResponse, UpdateBrandResponse, BrandFilter } from '~/@types/brand'
import { MessageResponse } from '~/@types/util'
import API from '~/constants/api'
import http from '~/utils/http'

const brandsApi = {
    getAllBrands: (params?: BrandFilter) => {
        return http.get<ListBrandResponse>(API.BRAND, {
            params
        })
    },
    createBrand: (data: { name: string }) => {
        return http.post<CreateBrandResponse>(API.BRAND, data)
    },
    updateBrand: (id: number, data: { name: string }) => {
        return http.patch<UpdateBrandResponse>(`${API.BRAND}/${id}`, data)
    },
    getBrandById: (id: number) => {
        return http.get<BrandResponse>(`${API.BRAND}/${id}`)
    },
    updateManyStatusBrand: (data: { brand_ids: number[] }) => {
        return http.patch<MessageResponse>(`${API.BRAND}/status`, data)
    }
}

export default brandsApi
