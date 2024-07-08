import {
    ListCategoryResponse,
    CreateCategoryResponse,
    CategoryResponse,
    UpdateCategoryResponse,
    CategoryFilter
} from '~/@types/category'
import { MessageResponse } from '~/@types/util'
import API from '~/constants/api'
import http from '~/utils/http'

const categoriesApi = {
    getAllCategories: (params?: CategoryFilter) => {
        return http.get<ListCategoryResponse>(API.CATEGORY, {
            params
        })
    },
    createCategory: (data: { name: string }) => {
        return http.post<CreateCategoryResponse>(API.CATEGORY, data)
    },
    updateCategory: (id: number, data: { name: string }) => {
        return http.patch<UpdateCategoryResponse>(`${API.CATEGORY}/${id}`, data)
    },
    getCategoryById: (id: number) => {
        return http.get<CategoryResponse>(`${API.CATEGORY}/${id}`)
    },
    updateManyStatusCategory: (data: { category_ids: number[] }) => {
        return http.patch<MessageResponse>(`${API.CATEGORY}/status`, data)
    }
}

export default categoriesApi
