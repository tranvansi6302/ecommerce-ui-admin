import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { OrderFilters } from '~/@types/order'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof OrderFilters]: string
}

export default function useQueryOrders() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    search: queryParams.search,
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
