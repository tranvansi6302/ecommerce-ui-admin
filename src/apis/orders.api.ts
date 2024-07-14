import { ListOrderResponse, OrderFilters, OrderResponse } from '~/@types/order'
import API from '~/constants/api'
import http from '~/utils/http'

const ordersApi = {
    getAllOrders: (params: OrderFilters) => {
        return http.get<ListOrderResponse>(API.ORDER, {
            params
        })
    },
    getOrderById: (id: number) => {
        return http.get<OrderResponse>(API.ORDER + `/${id}`)
    },
    updateStatusOrder: (id: number, body: { status: string; canceled_reason?: string }) => {
        return http.patch<OrderResponse>(API.ORDER + `/${id}`, body)
    }
}
export default ordersApi
