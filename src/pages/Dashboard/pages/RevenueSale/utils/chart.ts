import { RenvenueSale } from '~/@types/renvenue'

// Điều chỉnh hàm groupSalesByTimeRange
export const groupSalesByTimeRange = (sales: RenvenueSale[], timeType: 'week' | 'month' | 'quarter' | 'year') => {
    return sales.reduce(
        (acc, sale) => {
            const date = new Date(sale.timestamp)
            let period: string

            switch (timeType) {
                case 'week': {
                    const weekNum = Math.ceil((date.getDate() + new Date(date.getFullYear(), 0, 1).getDay()) / 7)
                    period = `Tuần ${weekNum} - Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
                    break
                }
                case 'month': {
                    period = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
                    break
                }
                case 'quarter': {
                    const quarter = Math.floor(date.getMonth() / 3) + 1
                    period = `Quý ${quarter}/${date.getFullYear()}`
                    break
                }
                case 'year': {
                    period = `Năm ${date.getFullYear()}`
                    break
                }
                default:
                    period = `Tuần 1 - Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
            }

            if (!acc[period]) {
                acc[period] = {
                    period,
                    revenue: 0,
                    quantity: 0,
                    profit: 0,
                    order_quantity: 0
                }
            }

            acc[period].revenue += sale.revenue
            acc[period].quantity += sale.quantity
            acc[period].profit += sale.profit
            acc[period].order_quantity += sale.order_quantity

            return acc
        },
        {} as Record<string, any>
    )
}

export interface TimeRange {
    label: string
    value: string
    start: Date
    end: Date
}

export const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`
    return amount.toLocaleString()
}

export const getTimeRanges = (type: 'week' | 'month'): TimeRange[] => {
    const ranges: TimeRange[] = []
    const today = new Date()
    const count = type === 'week' ? 4 : 3 // 4 tuần hoặc 3 tháng

    for (let i = 0; i < count; i++) {
        const start = new Date(today)
        if (type === 'week') {
            start.setDate(today.getDate() - 7 * i)
            const end = new Date(start)
            end.setDate(start.getDate() + 6)
            ranges.push({
                label: `Tuần ${i + 1} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`,
                value: `week-${i}`,
                start,
                end
            })
        } else {
            start.setMonth(today.getMonth() - i, 1)
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
            ranges.push({
                label: `Tháng ${start.getMonth() + 1}/${start.getFullYear()}`,
                value: `month-${i}`,
                start,
                end
            })
        }
    }
    return ranges
}

// Thêm hàm helper để lấy số từ chuỗi period
export const getNumberFromPeriod = (period: string): number => {
    const match = period.match(/\d+/)
    return match ? parseInt(match[0]) : 0
}

// Thêm hàm helper để lấy năm từ chuỗi period
export const getYearFromPeriod = (period: string): number => {
    const match = period.match(/\d{4}/)
    return match ? parseInt(match[0]) : 0
}

// Thêm hàm tính market share
export const calculateMarketShare = (data: any[], type: 'quantity' | 'revenue') => {
    const total = data.reduce((sum, item) => sum + (type === 'quantity' ? item.quantity_sale : item.revenue), 0)
    return data.map((item) => ({
        name: item.name,
        value: (((type === 'quantity' ? item.quantity_sale : item.revenue) / total) * 100).toFixed(1)
    }))
}
