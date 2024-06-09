import { CategoryResponse, CreateCategoryResponse } from '~/@types/category'
import API from '~/constants/api'
import http from '~/utils/http'

const categoriesApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>(API.CATEGORY)
    },
    createCategory: (data: { name: string }) => {
        return http.post<CreateCategoryResponse>(API.CATEGORY, data)
    }
}

export default categoriesApi
