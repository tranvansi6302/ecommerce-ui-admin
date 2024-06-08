import { ProductFilter } from './../@types/product.d'
import { isUndefined, omitBy } from 'lodash'
import useQueryParams from './useQueryParams'

type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function useQueryConfig() {
    const queryParams: QueryConfig = useQueryParams()
    const queryConfig: QueryConfig = omitBy(
        {
            name: queryParams.name,
            brand: queryParams.brand,
            category: queryParams.category,
            page: queryParams.page || '1',
            limit: queryParams.limit || '10'
        },
        isUndefined
    )

    return queryConfig
}
