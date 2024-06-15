import { ListUserResponse, UserFilter } from '~/@types/user'
import API from '~/constants/api'
import http from '~/utils/http'

const usersApi = {
    getAllUsers: (params: UserFilter) => {
        return http.get<ListUserResponse>(API.USER, {
            params
        })
    }
}

export default usersApi
