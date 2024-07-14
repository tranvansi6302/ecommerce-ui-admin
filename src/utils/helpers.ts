export const convertOrderStatus = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PENDING:
            return 'Chờ xác nhận'
        case OrderStatus.CONFIRMED:
            return 'Đã xác nhận'
        case OrderStatus.DELIVERING:
            return 'Đang giao hàng'
        case OrderStatus.DELIVERED:
            return 'Hoàn thành'
        case OrderStatus.CANCELLED:
            return 'Đã hủy'
        case OrderStatus.PAID:
            return 'Đã thanh toán'
        case OrderStatus.UNPAID:
            return 'Chưa thanh toán'
        default:
            return 'Không xác định'
    }
}
