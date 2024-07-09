import { InputTextarea } from 'primereact/inputtextarea'
import { UseFormRegister } from 'react-hook-form'
import { Fragment, useEffect, useState } from 'react'

interface MyTextareaProps {
    register?: UseFormRegister<any>
    placeholder: string
    className?: string
    classNameLabel?: string
    name: string
    style?: React.CSSProperties
    label?: string
    message?: string
    value?: string
    defaultValue?: string
    onChange?: (e: any) => void
    errors?: boolean | any
    styleMessage?: React.CSSProperties
}

export default function MyTextarea({
    placeholder,
    className,
    classNameLabel,
    name,
    style,
    label,
    value,
    defaultValue,
    onChange,
    errors,
    styleMessage,
    register
}: MyTextareaProps) {
    const [tempValue, setTempValue] = useState<string>(value || defaultValue || '')
    const registerResult = register && name ? register(name) : null
    const errorResult = errors && name ? Boolean(errors[name]) : false

    useEffect(() => {
        setTempValue(value || defaultValue || '')
    }, [value, defaultValue])

    const handleBlur = (e: any) => {
        if (onChange) {
            onChange(e)
        }
    }

    return (
        <Fragment>
            <label htmlFor={name} className={`block  ${classNameLabel}`}>
                {label}
            </label>
            <InputTextarea
                {...registerResult}
                placeholder={placeholder}
                className={`${errorResult ? 'border-red-500' : ''} ${className}`}
                id={name}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                name={name}
                rows={5}
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
