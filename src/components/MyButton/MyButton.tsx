import { Button } from 'primereact/button'
import Spinner from '../Spinner'

interface MyButtonProps {
    children?: React.ReactNode
    className?: string
    loading?: boolean
    severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger'
    text?: boolean
    raised?: boolean
    outlined?: boolean
    size?: 'small' | 'large'
    icon?: JSX.Element | string
    onClick?: () => void
}

export default function MyButton({
    children,
    loading,
    severity = 'info',
    text,
    raised,
    outlined,
    className,
    size = 'small',
    icon,
    onClick
}: MyButtonProps) {
    return (
        <Button
            icon={icon}
            disabled={loading}
            text={text}
            raised={raised}
            outlined={outlined}
            severity={severity}
            size={size}
            className={`flex justify-center  ${className}`}
            onClick={onClick}
        >
            <div className='min-w-14  flex justify-center items-center'> {loading ? <Spinner /> : children}</div>
        </Button>
    )
}
