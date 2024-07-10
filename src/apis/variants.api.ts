import { ListVariantResponse, UpdateVariantResponse } from '~/@types/variant'
import API from '~/constants/api'
import { VariantSchemaType } from '~/schemas/variant.schema'
import http from '~/utils/http'

type UpdateVariantRequest = VariantSchemaType

const variantsApi = {
    getAllVariants: (params: { search: string; category: string; brand: string }) => {
        return http.get<ListVariantResponse>(API.VARIANT, {
            params
        })
    },
    updateVariant: (id: number, body: UpdateVariantRequest) => {
        return http.patch<UpdateVariantResponse>(`${API.VARIANT}/${id}`, body)
    }
}

export default variantsApi
