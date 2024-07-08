const API = {
    URL: import.meta.env.VITE_APP_API_URL,
    LOGIN: '/auth/login',
    PRODUCT: '/products',
    BRAND: '/brands',
    CATEGORY: '/categories',
    SUPPLIER: '/suppliers',
    VARIANT: '/variants',
    PURCHASE_ORDER: '/purchase-orders',
    WAREHOUSE: '/warehouses',
    PRICE_PLAN: '/price-plans',
    PRICE_PLAN_HISTORY: '/price-plans/history',
    USER: '/users',
    LOGOUT: '/auth/logout'
}

export default API
