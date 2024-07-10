import { MessageResponse } from '~/@types/util'
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
    },
    deleteManyVariants: (body: { variant_ids: number[] }) => {
        return http.delete<MessageResponse>(API.VARIANT, {
            data: body
        })
    }
}

export default variantsApi
