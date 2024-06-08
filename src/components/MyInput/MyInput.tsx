import { InputText } from 'primereact/inputtext'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputProps {
    register?: UseFormRegister<any>
    type?: 'text' | 'password' | 'email' | 'number'
    placeholder: string
    className?: string
    classNameLabel?: string
    name: string
    style?: React.CSSProperties
    label: string
    message?: string
    errors?: boolean | any
    styleMessage?: React.CSSProperties
}

export default function MyInput({
    type = 'text',
    placeholder,
    className,
    classNameLabel,
    name,
    style,
    label,
    errors,
    styleMessage,
    register
}: MyInputProps) {
    const registerResult = register && name ? register(name) : null
    const errorResult = errors && name ? Boolean(errors[name]) : false
    return (
        <Fragment>
            <label htmlFor={name} className={`block  ${classNameLabel}`}>
                {label}
            </label>
            <InputText
                {...registerResult}
                id={name}
                type={type}
                placeholder={placeholder}
                className={`${errorResult ? 'border-red-500' : ''} ${className}`}
                name={name}
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