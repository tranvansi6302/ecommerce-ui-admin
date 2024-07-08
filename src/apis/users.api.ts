import { ListUserResponse, UpdateUserResponse, UserFilter, UserResponse } from '~/@types/user'
import { MessageResponse } from '~/@types/util'
import API from '~/constants/api'
import { UserSchemaType } from '~/schemas/user.schema'
import http from '~/utils/http'

export type UpdateUserRequest = UserSchemaType

const usersApi = {
    getAllUsers: (params: UserFilter) => {
        return http.get<ListUserResponse>(API.USER, {
            params
        })
    },
    getUserById: (id: number) => {
        return http.get<UserResponse>(`${API.USER}/${id}`)
    },
    updateUser: (id: number, body: UpdateUserRequest) => {
        return http.patch<UpdateUserResponse>(`${API.USER}/${id}`, body)
    },
    uploadAvatarUser: (id: number, body: FormData) => {
        return http.patch<UpdateUserResponse>(`${API.USER}/${id}/upload`, body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    updateStatusManyUsers: (body: { user_ids: number[] }) => {
        return http.patch<MessageResponse>(`${API.USER}/status`, body)
    },
    deleteSoftManyUsers: (body: { user_ids: number[] }) => {
        return http.delete<MessageResponse>(API.USER, {
            data: body
        })
    },
    restoreManyUsers: (body: { user_ids: number[] }) => {
        return http.patch<MessageResponse>(`${API.USER}/restore`, body)
    }
}

export default usersApi
