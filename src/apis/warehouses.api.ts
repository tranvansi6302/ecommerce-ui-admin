import API from '~/constants/api'
import http from '~/utils/http'
import { ListWarehouseResponse, WarehouseFilter, WarehouseResponse } from './../@types/warehouse.d'

const warehousesApi = {
    getAllWarehouses: (params: WarehouseFilter) => {
        return http.get<ListWarehouseResponse>(API.WAREHOUSE, {
            params
        })
    },
    getWarehouseById: (id: number) => {
        return http.get<WarehouseResponse>(API.WAREHOUSE + `/${id}`)
    }
}

export default warehousesApi
