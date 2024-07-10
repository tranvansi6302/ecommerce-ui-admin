import { InputText } from 'primereact/inputtext'
import { KeyFilterType } from 'primereact/keyfilter'
import { useEffect, useState } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputNumberV2BlurProps {
    register?: UseFormRegister<any>
    type?: 'text' | 'password' | 'email' | 'number'
    placeholder?: string
    className?: string
    classNameLabel?: string
    name: string
    style?: React.CSSProperties
    label?: string
    message?: string
    errors?: boolean | any
    value?: string | number
    onBlur?: (e: any) => void
    defaultValue?: string | number
    styleMessage?: React.CSSProperties
    keyfilter?: KeyFilterType
}

export default function MyInputNumberV2Blur({
    type = 'text',
    placeholder,
    className,
    classNameLabel,
    name,
    style,
    label,
    keyfilter,
    errors,
    value,
    defaultValue,
    styleMessage,
    onBlur,
    register
}: MyInputNumberV2BlurProps) {
    // Initialize tempValue with an empty string if both value and defaultValue are undefined
    const [tempValue, setTempValue] = useState(value?.toString() || defaultValue?.toString() || 0)
    const registerResult = register && name ? register(name) : null
    const errorResult = errors && name ? Boolean(errors[name]) : false
    useEffect(() => {
        setTempValue(value || defaultValue || 0)
    }, [value, defaultValue])
    return (
        <Fragment>
            <label htmlFor={name} className={`block  ${classNameLabel}`}>
                {label}
            </label>
            <InputText
                {...registerResult}
                keyfilter={keyfilter}
                id={name}
                type={type}
                value={(tempValue as string) || '0'} // Always controlled
                placeholder={placeholder}
                className={`${errorResult ? 'border-red-500' : ''} ${className}`}
                name={name}
                onBlur={onBlur}
                onChange={(e) => setTempValue(e.target.value)}
                style={style}
                autoComplete='on'
            />
            {errors && (
                <p style={styleMessage} className='mb-4 mt-1 text-red-500 text-[15px] px-2'>
                    {errors[name]?.message}
                </p>
            )}
        </Fragment>
    )
}
