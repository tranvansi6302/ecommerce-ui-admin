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
}

export default function MyInputSearch({ placeholder, className, name, style, register, value, onChange }: MyInputSearchProps) {
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
                    className={className}
                    name={name}
                    style={style}
                    autoComplete='on'
                />
            </div>
        </Fragment>
    )
}
