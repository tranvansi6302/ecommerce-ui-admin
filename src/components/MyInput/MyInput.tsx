import { InputText } from 'primereact/inputtext'
import { KeyFilterType } from 'primereact/keyfilter'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputProps {
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
    onChange?: (e: any) => void
    defaultValue?: string | number
    styleMessage?: React.CSSProperties
    keyFilter?: KeyFilterType
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
    value,
    defaultValue,
    styleMessage,
    onChange,
    register,
    keyFilter
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
                keyfilter={keyFilter}
                type={type}
                value={value?.toString()}
                placeholder={placeholder}
                className={`${errorResult ? 'border-red-500' : ''} ${className}`}
                name={name}
                onChange={onChange}
                defaultValue={defaultValue?.toString()}
                style={style}
                autoComplete='on'
            />
            {errors && (
                <p style={styleMessage} className='mb-4 mt-1 text-red-500 text-[14px] px-2'>
                    {errors[name]?.message}
                </p>
            )}
        </Fragment>
    )
}
