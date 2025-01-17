import {
    RenvenueBrands,
    RenvenueCategories,
    RenvenueProducts,
    RenvenueSale,
    RevenueWarehouseBrandsResponse,
    RevenueWarehouseCategoriesResponse,
    RevenueWarehouseHistoryResponse
} from '~/@types/renvenue'
import http from '~/utils/http'

const renvenueApi = {
    getSale: () => {
        return http.get<RenvenueSale[]>('/revenue/sales')
    },

    getProducts: () => {
        return http.get<RenvenueProducts[]>('/revenue/products')
    },
    getBrands: () => {
        return http.get<RenvenueBrands[]>('/revenue/brands')
    },
    getCategories: () => {
        return http.get<RenvenueCategories[]>('/revenue/categories')
    },
    getWarehouseHistory: () => {
        return http.get<RevenueWarehouseHistoryResponse[]>('/revenue/warehouses')
    },
    getWarehouseCategories: () => {
        return http.get<RevenueWarehouseCategoriesResponse[]>('/revenue/warehouses/categories')
    },
    getWarehouseBrands: () => {
        return http.get<RevenueWarehouseBrandsResponse[]>('/revenue/warehouses/brands')
    }
}

export default renvenueApi
