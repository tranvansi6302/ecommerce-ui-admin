import { CategoryResponse, CreateCategoryResponse, GetCategory, UpdateCategoryResponse } from '~/@types/category'
import API from '~/constants/api'
import http from '~/utils/http'

const categoriesApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>(API.CATEGORY)
    },
    createCategory: (data: { name: string }) => {
        return http.post<CreateCategoryResponse>(API.CATEGORY, data)
    },
    updateCategory: (id: number, data: { name: string }) => {
        return http.patch<UpdateCategoryResponse>(`${API.CATEGORY}/${id}`, data)
    },
    getCategoryById: (id: number) => {
        return http.get<GetCategory>(`${API.CATEGORY}/${id}`)
    }
}

export default categoriesApi
