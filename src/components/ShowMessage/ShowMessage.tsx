import { Messages } from 'primereact/messages'
import { useEffect, useRef } from 'react'

interface ShowMessageProps {
    severity?: 'success' | 'info' | 'warn' | 'error'
    detail: string
}

export default function ShowMessage({ severity = 'success', detail }: ShowMessageProps) {
    const msgs = useRef<Messages>(null)

    useEffect(() => {
        console.log('ShowMessage', severity, detail)
        msgs.current?.clear()
        msgs.current?.show([{ sticky: true, severity, detail }])
    }, [severity, detail])

    return (
        <div className='card'>
            <Messages ref={msgs} />
        </div>
    )
}
