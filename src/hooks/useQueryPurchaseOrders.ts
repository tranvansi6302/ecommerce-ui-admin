import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { PurchaseOrderFilter } from './../@types/purchase.d'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof PurchaseOrderFilter]: string
}

export default function useQueryPurchaseOrders() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    search: queryParams.search,
                    supplier: queryParams.supplier,
                    status: queryParams.status,
                    page: queryParams.page || '1',
                    limit: queryParams.limit || '5'
                },
                isUndefined
            ),
        [queryParams]
    )

    return queryConfig
}
