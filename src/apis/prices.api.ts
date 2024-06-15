import { CreatePricePlan } from '~/@types/price'
import API from '~/constants/api'
import http from '~/utils/http'

type CreatePricePlanRequest = {
    price_plans: CreatePricePlan[]
}

const pricesApi = {
    createPricePlan: (body: CreatePricePlanRequest) => {
        return http.post(API.PRICE_PLAN, body)
    }
}

export default pricesApi
