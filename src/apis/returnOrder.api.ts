import { ReturnOrderFilter, ReturnOrderListResponse, ReturnOrderResponseDetail } from '~/@types/returnOrder'
import http from '~/utils/http'

interface ReturnOrderUpdateRequest {
    order_return_id: number
    status: string
    rejected_reason?: string
}

export const returnOrderApi = {
    getList: (params: ReturnOrderFilter) => {
        return http.get<ReturnOrderListResponse>('/return-orders', { params })
    },

    updateStatus: (data: ReturnOrderUpdateRequest) => {
        return http.patch(`/return-orders`, data)
    },

    getDetail: (id: number) => {
        return http.get<ReturnOrderResponseDetail>(`/return-orders/${id}`)
    }
}
