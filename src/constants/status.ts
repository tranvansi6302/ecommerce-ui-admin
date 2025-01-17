export const PURCHASE_ORDER_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const

export const SUPPLIER_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const

export const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED'
} as const

export const PRODUCT_STATUS = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE'
} as const

export const ORDER_STATUS = {
    PAID: 'PAID',
    PENDING: 'PENDING',
    UNPAID: 'UNPAID',
    CONFIRMED: 'CONFIRMED',
    DELIVERING: 'DELIVERING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const

export const RETURN_ORDER_STATUS = {
    REQUESTED: 'REQUESTED',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
} as const

export const PAYMENT_METHOD = {
    CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
    MOMO: 'MOMO',
    VNPAY: 'VNPAY'
} as const

export enum ReturnOrderStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}
