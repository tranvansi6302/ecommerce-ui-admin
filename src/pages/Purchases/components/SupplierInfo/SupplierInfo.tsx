import { ReactNode } from 'react'

interface SupplierInfoProps {
    title: string
    icon: ReactNode
    value: string
}

export default function SupplierInfo({ title, icon, value }: SupplierInfoProps) {
    return (
        <div className='flex items-center gap-2'>
            <span className='flex items-center gap-2 min-w-[155px]'>
                {icon}
                {`${title}:`}
            </span>
            <p className='text-blue-600'>{value}</p>
        </div>
    )
}
