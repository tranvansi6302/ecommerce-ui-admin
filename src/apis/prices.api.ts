import {
    CreatePricePlan,
    CreatePricePlanResponse,
    ListPricePlanCurrentResponse,
    PricePlanFilter,
    UpdatePricePlanResponse
} from '~/@types/price'
import API from '~/constants/api'
import http from '~/utils/http'

export type CreatePricePlanRequest = {
    price_plans: CreatePricePlan[]
}

const pricesApi = {
    createPricePlan: (body: CreatePricePlanRequest) => {
        return http.post<CreatePricePlanResponse>(API.PRICE_PLAN, body)
    },
    getAllPricePlansCurrent: (params: PricePlanFilter) => {
        return http.get<ListPricePlanCurrentResponse>(API.PRICE_PLAN, {
            params
        })
    },
    getAllPricePlansHistory: (params: PricePlanFilter) => {
        return http.get<ListPricePlanCurrentResponse>(API.PRICE_PLAN_HISTORY, {
            params
        })
    },
    updatePricePlan: (
        id: number,
        body: {
            sale_price: string
            promotion_price: string
        }
    ) => {
        return http.patch<UpdatePricePlanResponse>(`${API.PRICE_PLAN}/${id}`, body)
    }
}

export default pricesApi
