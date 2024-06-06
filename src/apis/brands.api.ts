import { BrandResponse } from '~/@types/brand'
import API from '~/constants/api'
import http from '~/utils/http'

const brandsApi = {
    getAllBrands: () => {
        return http.get<BrandResponse>(API.GET_ALL_BRAND)
    }
}

export default brandsApi
