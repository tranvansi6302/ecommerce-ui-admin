import { CreatePricePlan, ListPricePlanCurrentResponse, PricePlanFilter } from '~/@types/price'
import API from '~/constants/api'
import http from '~/utils/http'

export type CreatePricePlanRequest = {
    price_plans: CreatePricePlan[]
}

const pricesApi = {
    createPricePlan: (body: CreatePricePlanRequest) => {
        return http.post(API.PRICE_PLAN, body)
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
    }
}

export default pricesApi
