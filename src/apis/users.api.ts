import { ListUserResponse, UpdateUserResponse, UserFilter, UserResponse } from '~/@types/user'
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
    }
}

export default usersApi
