import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRoutesElement from './routers/router'
import { useEffect } from 'react'
import PATH from './constants/path'

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname === PATH.ROOT) {
            navigate(PATH.DASHBOARD)
        }
    }, [location.pathname, navigate])

    const elementRoutes = useRoutesElement()
    return (
        <main>
            {elementRoutes}
            <ToastContainer autoClose={600} />
        </main>
    )
}

export default App
