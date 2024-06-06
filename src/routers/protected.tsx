import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import PATH from '~/constants/path'
import { AppContext } from '~/contexts/app.context'

export const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AppContext)

    return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}
export const RejectedRoute = () => {
    const { isAuthenticated } = useContext(AppContext)

    return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.DASHBOARD} />
}
