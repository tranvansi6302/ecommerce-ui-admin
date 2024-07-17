import axios, { AxiosInstance } from 'axios'
import API from '~/constants/api'

class HttpGhn {
    instance: AxiosInstance
    private token: string
    constructor() {
        this.token = import.meta.env.VITE_API_GHN_TOKEN as string
        this.instance = axios.create({
            baseURL: API.BASE_API_GHN_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                token: this.token,
                ShopId: import.meta.env.VITE_API_GHN_SHOP_ID as string
            }
        })
    }
}
const httpGhn = new HttpGhn().instance
export default httpGhn
