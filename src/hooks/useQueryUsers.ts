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
                    is_deleted: queryParams.is_deleted,
                    page: queryParams.page || '1',
                    limit: queryParams.limit || '5'
                },
                isUndefined
            ),
        [queryParams]
    )

    return queryConfig
}
