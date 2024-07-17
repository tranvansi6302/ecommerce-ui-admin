import { ConfirmOrderRequest, CreateOrderGHNResponse, GenTokenResponse } from '~/@types/ghn'
import API from '~/constants/api'
import httpGhn from '~/utils/httpghn'

const ghnApi = {
    createOrder: (data: ConfirmOrderRequest) => {
        return httpGhn.post<CreateOrderGHNResponse>(API.CREATE_ORDER, data)
    },
    genToken: (data: { order_codes: string[] }) => {
        return httpGhn.post<GenTokenResponse>(API.GEN_TOKEN, data)
    }
}

export default ghnApi
