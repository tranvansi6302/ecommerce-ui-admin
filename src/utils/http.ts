import axios, { AxiosInstance } from 'axios'
import { getTokenFromLS, saveProfileToLS, saveTokenToLS } from './save'
import API from '~/constants/api'
import { LoginResponse } from '~/@types/auth'

class Http {
    instance: AxiosInstance
    private token: string
    constructor() {
        this.token = getTokenFromLS()
        this.instance = axios.create({
            baseURL: API.URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.instance.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.authorization = `Bearer ${this.token}`
                return config
            }
            return config
        })
        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config
                switch (url) {
                    case API.LOGIN: {
                        this.token = (response.data as LoginResponse).result.token
                        const profile = (response?.data as LoginResponse).result.user
                        saveTokenToLS(this.token)
                        saveProfileToLS(profile)
                        break
                    }
                    default:
                }

                return response
            },
            (error) => {
                return Promise.reject(error)
            }
        )
    }
}
const http = new Http().instance
export default http
