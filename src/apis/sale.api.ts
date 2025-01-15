import http from '~/utils/http'

interface SaleResponse {
    id: number
    product_id: number
    product_name: string
    total_sold: number
    created_at: string
    updated_at: string
}

const saleApi = {
    getAll: () => {
        return http.get<SaleResponse[]>('/sales')
    }
}

export default saleApi
