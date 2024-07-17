import { ConfirmOrderRequest, CreateOrderGHNResponse } from '~/@types/ghn'
import API from '~/constants/api'
import httpGhn from '~/utils/httpghn'

const ghnApi = {
    createOrder: (data: ConfirmOrderRequest) => {
        return httpGhn.post<CreateOrderGHNResponse>(API.CREATE_ORDER, data)
    }
}

export default ghnApi
