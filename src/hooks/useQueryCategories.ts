import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { CategoryFilter } from '~/@types/category'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof CategoryFilter]: string
}

export default function useQueryCategories() {
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
