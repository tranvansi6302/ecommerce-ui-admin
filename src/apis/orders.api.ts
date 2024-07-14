import { ListOrderResponse, OrderFilters } from '~/@types/order'
import API from '~/constants/api'
import http from '~/utils/http'

const ordersApi = {
    getAllOrders: (params: OrderFilters) => {
        return http.get<ListOrderResponse>(API.ORDER, {
            params
        })
    }
}
export default ordersApi
