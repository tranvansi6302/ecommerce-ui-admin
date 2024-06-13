import { useEffect, useContext } from 'react'
import { AppContext } from '~/contexts/app.context'

const useSetTitle = (title: string) => {
    const { setTitle } = useContext(AppContext)

    useEffect(() => {
        setTitle(title)
        document.title = title
    }, [title, setTitle])
}

export default useSetTitle
