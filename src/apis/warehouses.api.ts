import API from '~/constants/api'
import http from '~/utils/http'
import { ListWarehouseResponse, WarehouseFilter } from './../@types/warehouse.d'

const warehousesApi = {
    getAllWarehouses: (params: WarehouseFilter) => {
        return http.get<ListWarehouseResponse>(API.WAREHOUSE, {
            params
        })
    }
}

export default warehousesApi
