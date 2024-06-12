import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyDropdownProps {
    register?: UseFormRegister<any>
    errors?: boolean | any
    value: string | number | any
    name: string
    onChange: (e: DropdownChangeEvent) => void
    options: any
    optionLabel: string
    placeholder: string
    className?: string
}

export default function MyDropdown({
    register,
    errors,
    value,
    onChange,
    options,
    optionLabel,
    placeholder,
    className,
    name
}: MyDropdownProps) {
    const registerResult = register && name ? register(name) : null
    const errorResult = errors && name ? Boolean(errors[name]) : false

    return (
        <Fragment>
            <Dropdown
                {...registerResult}
                filter
                value={value}
                onChange={onChange}
                options={options}
                optionLabel={optionLabel}
                placeholder={placeholder}
                panelClassName='text-[13.6px]'
                className={`font-normal h-[40px] flex items-center ${className}`}
                data-pr-classname='custom-select'
                style={{
                    borderRadius: '2px',
                    fontSize: '13.6px',
                    borderColor: errorResult ? '#ef4444' : '#d1d5db',
                    width: '100%'
                }}
                inputId={name}
                name={name}
                autoComplete='on'
            />
            {errors && <p className='mb-4 mt-1 text-red-500 text-[13.6px] px-2'>{errors[name]?.message}</p>}
        </Fragment>
    )
}
