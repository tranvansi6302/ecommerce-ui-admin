import { useRoutes } from 'react-router-dom'
import PATH from '~/constants/path'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import BrandList from '~/pages/Brands'
import CategoryList from '~/pages/Categories'
import RevenueSale from '~/pages/Dashboard/pages/RevenueSale'
import RevenueWarehouse from '~/pages/Dashboard/pages/RevenueWarehouse'
import Login from '~/pages/Login'
import OrderDetail from '~/pages/Orders/components/OrderDetail'
import OrderList from '~/pages/Orders/OrderList'
import ReturnOrderDetail from '~/pages/Orders/ReturnOrderDetail'
import ReturnOrders from '~/pages/Orders/ReturnOrders'
import PricePlanList from '~/pages/PricePlans'
import CreatePricePlan from '~/pages/PricePlans/components/CreatePricePlan'
import PricePlanHistory from '~/pages/PricePlans/components/PricePlanHistory'
import ProductList from '~/pages/Products'
import CreateProduct from '~/pages/Products/components/CreateProduct'
import UpdateProduct from '~/pages/Products/components/UpdateProduct'
import ProductSale from '~/pages/ProductSale'
import PurchaseOrderList from '~/pages/Purchases'
import CreatePurchaseOrder from '~/pages/Purchases/components/CreatePurchaseOrder'
import UpdatePurchaseOrder from '~/pages/Purchases/components/UpdatePurchaseOrder'
import SupplierList from '~/pages/Suppliers'
import CreateSupplier from '~/pages/Suppliers/components/CreateSupplier'
import UpdateSupplier from '~/pages/Suppliers/components/UpdateSupplier'
import UserList from '~/pages/Users'
import UpdateUser from '~/pages/Users/components/UpdateUser'
import WarehouseList from '~/pages/Warehouses'
import { ProtectedRoute, RejectedRoute } from './protected'

export default function useRoutesElement() {
    return useRoutes([
        {
            path: PATH.EMPTY,
            element: <ProtectedRoute />,
            children: [
                {
                    path: PATH.REVENUE_SALE,
                    element: (
                        <MainLayout>
                            <RevenueSale />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.REVENUE_WAREHOUSE,
                    element: (
                        <MainLayout>
                            <RevenueWarehouse />
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
                    path: PATH.PRODUCT_EDIT,
                    element: (
                        <MainLayout>
                            <UpdateProduct />
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
                },
                {
                    path: PATH.PRICE_PLAN_LIST,
                    element: (
                        <MainLayout>
                            <PricePlanList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PRICE_PLAN_LIST_HISTORY,
                    element: (
                        <MainLayout>
                            <PricePlanHistory />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PRICE_PLAN_LIST_CREATE,
                    element: (
                        <MainLayout>
                            <CreatePricePlan />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.USER_LIST,
                    element: (
                        <MainLayout>
                            <UserList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.USER_UPDATE,
                    element: (
                        <MainLayout>
                            <UpdateUser />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.PRODUCT_SALE,
                    element: (
                        <MainLayout>
                            <ProductSale />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.ORDER_LIST,
                    element: (
                        <MainLayout>
                            <OrderList />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.ORDER_DETAIL,
                    element: (
                        <MainLayout>
                            <OrderDetail />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.RETURN_ORDERS,
                    element: (
                        <MainLayout>
                            <ReturnOrders />
                        </MainLayout>
                    )
                },
                {
                    path: PATH.RETURN_ORDERS + '/:id',
                    element: (
                        <MainLayout>
                            <ReturnOrderDetail />
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
