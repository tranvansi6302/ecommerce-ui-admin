import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { SupplierFilter } from '~/@types/supplier'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof SupplierFilter]: string
}

export default function useQuerySuppliers() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    status: queryParams.status,
                    search: queryParams.search,
                    page: queryParams.page || '1',
                    limit: queryParams.limit || '5'
                },
                isUndefined
            ),
        [queryParams]
    )

    return queryConfig
}
