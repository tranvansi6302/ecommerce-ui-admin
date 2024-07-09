import { ProductFilter } from '../@types/product'
import { isUndefined, omitBy } from 'lodash'
import useQueryParams from './useQueryParams'
import { useMemo } from 'react'

type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function useQueryProducts() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    name: queryParams.name,
                    brand: queryParams.brand,
                    status: queryParams.status,
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
