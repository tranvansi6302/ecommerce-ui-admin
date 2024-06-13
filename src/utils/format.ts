import { PURCHASE_ORDER_STATUS, SUPPLIER_STATUS } from '~/constants/status'

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export const formatCurrencyVND = (currency: number) => {
    return currency.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
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
