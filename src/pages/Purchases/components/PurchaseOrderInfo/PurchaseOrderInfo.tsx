interface PurchaseOrderInfoProps {
    title: string
    value: string
}
export default function PurchaseOrderInfo({ title, value }: PurchaseOrderInfoProps) {
    return (
        <div className='flex items-center gap-2'>
            <div className='min-w-[150px]'>{`${title}:`}</div>
            <p className='text-blue-600'>{value}</p>
        </div>
    )
}
