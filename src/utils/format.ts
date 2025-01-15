import {
    ORDER_STATUS,
    PAYMENT_METHOD,
    PRODUCT_STATUS,
    PURCHASE_ORDER_STATUS,
    RETURN_ORDER_STATUS,
    SUPPLIER_STATUS
} from '~/constants/status'
export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export const formatCurrencyVND = (currency: number) => {
    return (currency && currency.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })) ?? 0
}

export const convertPurchaseOrderStatus = (status: string) => {
    switch (status) {
        case PURCHASE_ORDER_STATUS.PENDING:
            return 'Chờ xác nhận'
        case PURCHASE_ORDER_STATUS.COMPLETED:
            return 'Đã xác nhận'
        case PURCHASE_ORDER_STATUS.CANCELLED:
            return 'Đã hủy'
        default:
            return ''
    }
}

export const convertSupplierStatus = (status: string) => {
    switch (status) {
        case SUPPLIER_STATUS.ACTIVE:
            return 'Đang giao dịch'
        case SUPPLIER_STATUS.INACTIVE:
            return 'Ngừng giao dịch'
        default:
            return ''
    }
}

export const convertUserStatus = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'Hoạt động'
        case 'BLOCKED':
            return 'Vô hiệu hóa'
        default:
            return ''
    }
}

export const convertProductStatus = (status: string) => {
    switch (status) {
        case PRODUCT_STATUS.ACTIVE:
            return 'Đang kinh doanh'
        case PRODUCT_STATUS.INACTIVE:
            return 'Ngừng kinh doanh'

        default:
            return ''
    }
}

export const convertToLocaleDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const formatDateFull = (dateString: string) => {
    const date = new Date(dateString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${hours}:${minutes} ${day}/${month}/${year}`
}

export const convertOrderStatus = (status: string) => {
    switch (status) {
        case ORDER_STATUS.PENDING:
            return 'Chờ xác nhận'
        case ORDER_STATUS.CONFIRMED:
            return 'Đã xác nhận'
        case ORDER_STATUS.DELIVERING:
            return 'Đang giao hàng'
        case ORDER_STATUS.DELIVERED:
            return 'Hoàn thành'
        case ORDER_STATUS.CANCELLED:
            return 'Đã hủy'
        case ORDER_STATUS.PAID:
            return 'Đã thanh toán'
        case ORDER_STATUS.UNPAID:
            return 'Chưa thanh toán'
        default:
            return 'Không xác định'
    }
}

export const convertReturnOrderStatus = (status: string) => {
    switch (status) {
        case RETURN_ORDER_STATUS.REQUESTED:
            return 'Chờ xác nhận'
        case RETURN_ORDER_STATUS.ACCEPTED:
            return 'Đã xác nhận'
        case RETURN_ORDER_STATUS.REJECTED:
            return 'Đã từ chối'
        default:
            return ''
    }
}

export const convertPaymentMethod = (method: string) => {
    switch (method) {
        case PAYMENT_METHOD.CASH_ON_DELIVERY:
            return 'Thanh toán khi nhận hàng'
        case PAYMENT_METHOD.MOMO:
            return 'Thanh toán qua MoMo'
        case PAYMENT_METHOD.VNPAY:
            return 'Thanh toán qua VNPay'
        default:
            return 'Không xác định'
    }
}
