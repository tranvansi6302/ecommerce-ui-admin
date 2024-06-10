import { CreateSupplierResponse, ListSupplierResponse, SupplierResponse, UpdateSupplierResponse } from '~/@types/supplier'
import API from '~/constants/api'
import { SupplierSchemaType } from '~/schemas/supplier.schema'
import http from '~/utils/http'

export type CreateSupplierRequest = SupplierSchemaType
export type UpdateSupplierRequest = SupplierSchemaType & {
    status: string
}

const suppliersApi = {
    createSupplier: (data: CreateSupplierRequest) => {
        return http.post<CreateSupplierResponse>(API.SUPPLIER, data)
    },
    getAllSuppliers: () => {
        return http.get<ListSupplierResponse>(API.SUPPLIER)
    },
    getSupplierById: (id: number) => {
        return http.get<SupplierResponse>(`${API.SUPPLIER}/${id}`)
    },
    updateSupplier: (id: number, data: UpdateSupplierRequest) => {
        return http.patch<UpdateSupplierResponse>(`${API.SUPPLIER}/${id}`, data)
    }
}

export default suppliersApi
