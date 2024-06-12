import { ListVariantResponse } from '~/@types/variant'
import API from '~/constants/api'
import http from '~/utils/http'

const variantsApi = {
    getAllVariants: (params: { search: string; category: string; brand: string }) => {
        return http.get<ListVariantResponse>(API.VARIANT, {
            params
        })
    }
}

export default variantsApi
