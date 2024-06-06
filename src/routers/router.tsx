import { useRoutes } from 'react-router-dom'
import PATH from '~/constants/path'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import Dashboard from '~/pages/Dashboard'
import Login from '~/pages/Login'
import ProductList from '~/pages/Product/ProductList'
import { ProtectedRoute, RejectedRoute } from './protected'
import CreateProduct from '~/pages/Product/components/CreateProduct'

export default function useRoutesElement() {
    return useRoutes([
        {
            path: PATH.EMPTY,
            element: <ProtectedRoute />,
            children: [
                {
                    path: PATH.DASHBOARD,
                    element: (
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PRODUCT_LIST,
                    element: (
                        <MainLayout>
                            <ProductList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PRODUCT_CREATE,
                    element: (
                        <MainLayout>
                            <CreateProduct />
                        </MainLayout>
                    )
                }
            ]
        },
        {
            path: PATH.EMPTY,
            element: <RejectedRoute />,
            children: [
                {
                    path: PATH.LOGIN,
                    element: (
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    )
                }
            ]
        }
    ])
}
