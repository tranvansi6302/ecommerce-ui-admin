import {
    CreateSupplierResponse,
    ListSupplierResponse,
    SupplierFilter,
    SupplierResponse,
    UpdateSupplierResponse
} from '~/@types/supplier'
import API from '~/constants/api'
import { SupplierSchemaType } from '~/schemas/supplier.schema'
import http from '~/utils/http'

export type CreateSupplierRequest = Omit<SupplierSchemaType, 'status'>
export type UpdateSupplierRequest = SupplierSchemaType & {
    status: string
}

const suppliersApi = {
    createSupplier: (data: CreateSupplierRequest) => {
        return http.post<CreateSupplierResponse>(API.SUPPLIER, data)
    },
    getAllSuppliers: (params: SupplierFilter) => {
        return http.get<ListSupplierResponse>(API.SUPPLIER, {
            params
        })
    },
    getSupplierById: (id: number) => {
        return http.get<SupplierResponse>(`${API.SUPPLIER}/${id}`)
    },
    updateSupplier: (id: number, data: UpdateSupplierRequest) => {
        return http.patch<UpdateSupplierResponse>(`${API.SUPPLIER}/${id}`, data)
    }
}

export default suppliersApi
