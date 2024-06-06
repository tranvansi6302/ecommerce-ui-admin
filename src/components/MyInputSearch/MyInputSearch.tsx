import { InputText } from 'primereact/inputtext'
import { UseFormRegister } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'

interface MyInputSearchProps {
    register?: UseFormRegister<any>
    placeholder: string
    className?: string
    name: string
    style?: React.CSSProperties
}

export default function MyInputSearch({ placeholder, className, name, style, register }: MyInputSearchProps) {
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
                    className={className}
                    name={name}
                    style={style}
                    autoComplete='on'
                />
            </div>
        </Fragment>
    )
}
