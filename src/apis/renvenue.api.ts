import { RenvenueBrands, RenvenueCategories, RenvenueProducts, RenvenueSale } from '~/@types/renvenue'
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
    }
}

export default renvenueApi
