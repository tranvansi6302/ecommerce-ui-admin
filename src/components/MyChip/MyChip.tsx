import { Chips, ChipsChangeEvent } from 'primereact/chips'

interface MyChipProps {
    label: string
    value: string[]
    onChange: (e: ChipsChangeEvent) => void
    id: string
}

export default function MyChip({ label, value, onChange, id }: MyChipProps) {
    return (
        <div className='mt-3'>
            <label className='text-[13.6px] text-gray-900' htmlFor={id}>
                {label}
            </label>
            <Chips className='mt-1' value={value} onChange={onChange} inputId={id} />
        </div>
    )
}
