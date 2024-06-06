import { CategoryResponse } from '~/@types/category'
import API from '~/constants/api'
import http from '~/utils/http'

const categoriesApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>(API.CATEGORY)
    }
}

export default categoriesApi
