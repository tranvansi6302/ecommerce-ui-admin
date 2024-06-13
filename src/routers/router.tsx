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
import PurchaseOrderList from '~/pages/Purchases/PurchaseOrderList'
import CreatePurchaseOrder from '~/pages/Purchases/components/CreatePurchaseOrder'
import UpdatePurchaseOrder from '~/pages/Purchases/components/UpdatePurchaseOrder/UpdatePurchaseOrder'
import SupplierList from '~/pages/Suppliers/SupplierList'
import CreateSupplier from '~/pages/Suppliers/components/CreateSupplier'
import UpdateSupplier from '~/pages/Suppliers/components/UpdateSupplier'
import WarehouseList from '~/pages/Warehouses/WarehouseList'
import { ProtectedRoute, RejectedRoute } from './protected'

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
                            <PurchaseOrderList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PURCHASE_CREATE,
                    element: (
                        <MainLayout>
                            <CreatePurchaseOrder />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PURCHASE_UPDATE,
                    element: (
                        <MainLayout>
                            <UpdatePurchaseOrder />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.WAREHOURSE_LIST,
                    element: (
                        <MainLayout>
                            <WarehouseList />
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
