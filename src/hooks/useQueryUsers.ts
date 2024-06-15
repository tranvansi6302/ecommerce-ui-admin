import { isUndefined, omitBy } from 'lodash'
import { useMemo } from 'react'
import { UserFilter } from '~/@types/user'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof UserFilter]: string
}

export default function useQueryUsers() {
    const queryParams: QueryConfig = useQueryParams()

    const queryConfig: QueryConfig = useMemo(
        () =>
            omitBy(
                {
                    email: queryParams.email,
                    status: queryParams.status,
                    page: queryParams.page || '1',
                    limit: queryParams.limit || '10'
                },
                isUndefined
            ),
        [queryParams]
    )

    return queryConfig
}
