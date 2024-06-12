import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { UseFormRegister } from 'react-hook-form'

interface MyInputNumberProps {
    register?: UseFormRegister<any>
    placeholder?: string
    className?: string
    defaultValue?: number
    value?: number
    name: string
    style?: React.CSSProperties
    onValueChange: (event: InputNumberValueChangeEvent) => void
}

export default function MyInputNumber({
    register,
    placeholder,
    className,
    defaultValue,
    value,
    style,
    onValueChange,
    name
}: MyInputNumberProps) {
    const registerResult = register && name ? register(name) : {}
    return (
        <InputNumber
            {...registerResult}
            value={value}
            min={0}
            id={name}
            name={name}
            max={100000000}
            placeholder={placeholder}
            className={className}
            onValueChange={onValueChange}
            style={style}
            defaultValue={defaultValue}
        />
    )
}
