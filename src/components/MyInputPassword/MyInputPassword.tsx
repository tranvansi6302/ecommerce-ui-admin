import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputPasswordProps {
    register?: UseFormRegister<any>
    placeholder: string
    className: string
    name: string
    style: React.CSSProperties
    label: string
    message?: string
    errors?: boolean | any
}

export default function MyInputPassword({ placeholder, className, name, style, label, errors, register }: MyInputPasswordProps) {
    const registerResult = register && name ? register(name) : null
    const errorResult = errors && name ? Boolean(errors[name]) : false

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Fragment>
            <label htmlFor={name} className='block text-gray-900 text-[15px] font-medium mb-2'>
                {label}
            </label>
            <div className='relative w-full md:w-30rem'>
                <InputText
                    {...registerResult}
                    id={name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    className={`${className} ${errorResult ? 'border-red-500' : ''}`}
                    name={name}
                    style={style}
                    autoComplete='on'
                />

                <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'} eye-icon`} onClick={toggleShowPassword} />
            </div>
            {errors.password && <p className='mt-1 text-red-500 text-[14px] px-2'>{errors[name]?.message}</p>}
        </Fragment>
    )
}
