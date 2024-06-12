import { InputText } from 'primereact/inputtext'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputSearchProps {
    register?: UseFormRegister<any>
    placeholder: string
    className?: string
    name: string
    style?: React.CSSProperties
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: () => void
    onBlur?: () => void
}

export default function MyInputSearch({
    placeholder,
    className,
    name,
    style,
    register,
    value,
    onChange,
    onBlur,
    onFocus
}: MyInputSearchProps) {
    const registerResult = register && name ? register(name) : null

    return (
        <Fragment>
            <div className='search-container relative w-full md:w-30rem'>
                <i className='pi pi-search icon-search' />
                <InputText
                    {...registerResult}
                    id={name}
                    type='text'
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={className}
                    name={name}
                    style={style}
                    autoComplete='off'
                />
            </div>
        </Fragment>
    )
}
