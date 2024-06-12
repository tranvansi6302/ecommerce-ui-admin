import { useRoutes } from 'react-router-dom'
import PATH from '~/constants/path'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import BrandList from '~/pages/Brands/BrandList'
import CategoryList from '~/pages/Categories/CategoryList'
import Dashboard from '~/pages/Dashboard'
import Login from '~/pages/Login'
import ProductList from '~/pages/Products/ProductList'
import CreateProduct from '~/pages/Products/components/CreateProduct'
import { ProtectedRoute, RejectedRoute } from './protected'
import SupplierList from '~/pages/Suppliers/SupplierList'
import CreateSupplier from '~/pages/Suppliers/components/CreateSupplier'
import UpdateSupplier from '~/pages/Suppliers/components/UpdateSupplier'
import PurchaseList from '~/pages/Purchases/PurchaseList'
import CreatePurchase from '~/pages/Purchases/components/CreatePurchase'

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
                },
                {
                    path: PATH.CATEGORY_LIST,
                    element: (
                        <MainLayout>
                            <CategoryList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.BRAND_LIST,
                    element: (
                        <MainLayout>
                            <BrandList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.SUPPLIER_LIST,
                    element: (
                        <MainLayout>
                            <SupplierList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.SUPPLIER_CREATE,
                    element: (
                        <MainLayout>
                            <CreateSupplier />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.SUPPLIER_UPDATE,
                    element: (
                        <MainLayout>
                            <UpdateSupplier />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PURCHASE_LIST,
                    element: (
                        <MainLayout>
                            <PurchaseList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PURCHASE_CREATE,
                    element: (
                        <MainLayout>
                            <CreatePurchase />
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
