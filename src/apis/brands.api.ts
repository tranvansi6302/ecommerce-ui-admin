import { BrandResponse, CreateBrandResponse, GetBrand, UpdateBrandResponse } from '~/@types/brand'
import API from '~/constants/api'
import http from '~/utils/http'

const brandsApi = {
    getAllBrands: () => {
        return http.get<BrandResponse>(API.BRAND)
    },
    createBrand: (data: { name: string }) => {
        return http.post<CreateBrandResponse>(API.BRAND, data)
    },
    updateBrand: (id: number, data: { name: string }) => {
        return http.patch<UpdateBrandResponse>(`${API.BRAND}/${id}`, data)
    },
    getBrandById: (id: number) => {
        return http.get<GetBrand>(`${API.BRAND}/${id}`)
    }
}

export default brandsApi
