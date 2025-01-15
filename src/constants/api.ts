const API = {
    URL: import.meta.env.VITE_APP_API_URL,
    BASE_API_GHN_URL: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data',
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
    LOGOUT: '/auth/logout',
    ORDER: '/orders',

    // GHN
    CREATE_ORDER: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create',
    GEN_TOKEN: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token',
    PRINT_ORDER: 'https://dev-online-gateway.ghn.vn/a5/public-api/printA5'
}

export default API
// https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token
// https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/v2/a5/gen-token
