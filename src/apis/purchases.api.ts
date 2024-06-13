import {
    CreatePurchaseResponse,
    ListPurchaseResponse,
    PurchaseOrderFilter,
    PurchaseResponse,
    UpdatePurchaseResponse
} from '~/@types/purchase'
import API from '~/constants/api'
import { PurchaseSchemaType } from '~/schemas/purchase.schema'
import http from '~/utils/http'

export type CreatePurchaseOrderRequest = PurchaseSchemaType

export interface UpdatePurchaseOrderRequest {
    status: string
    cancel_reason?: string
    purchase_details:
        | {
              variant_id: number
              quantity_received: number
              note: string
          }[]
        | undefined
}

const purchasesApi = {
    getAllPurchaseOrders: (params: PurchaseOrderFilter) => {
        return http.get<ListPurchaseResponse>(API.PURCHASE_ORDER, {
            params
        })
    },
    getPurchaseOrderById: (id: number) => {
        return http.get<PurchaseResponse>(`${API.PURCHASE_ORDER}/${id}`)
    },
    createPurchase: (data: CreatePurchaseOrderRequest) => {
        return http.post<CreatePurchaseResponse>(API.PURCHASE_ORDER, data)
    },
    updatePurchase: (id: number, data: UpdatePurchaseOrderRequest) => {
        return http.patch<UpdatePurchaseResponse>(`${API.PURCHASE_ORDER}/${id}`, data)
    }
}

export default purchasesApi
