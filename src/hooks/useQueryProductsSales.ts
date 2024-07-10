import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { ProductSaleFilters } from '../@types/product'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof ProductSaleFilters]: string
}

export default function useQueryProductsSales() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    search: queryParams.search,
                    brand: queryParams.brand,
                    category: queryParams.category,
                    page: queryParams.page || '1',
                    limit: queryParams.limit || '5'
                },
                isUndefined
            ),
        [queryParams]
    )

    return queryConfig
}
