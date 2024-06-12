import { CreatePurchaseResponse } from '~/@types/purchase'
import API from '~/constants/api'
import { PurchaseSchemaType } from '~/schemas/purchase.schema'
import http from '~/utils/http'

export type CreatePurchaseRequest = PurchaseSchemaType

const purchasesApi = {
    createPurchase: (data: CreatePurchaseRequest) => {
        return http.post<CreatePurchaseResponse>(API.PURCHASE_ORDER, data)
    }
}

export default purchasesApi
