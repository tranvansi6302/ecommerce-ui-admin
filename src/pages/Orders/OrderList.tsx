import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import PATH from '~/constants/path'
import { formatDate } from '~/utils/format'

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { FaCheckDouble } from 'react-icons/fa'
import { Order, OrderDetail, OrderFilters } from '~/@types/order'
import ordersApi from '~/apis/orders.api'
import SetProductImage from '~/components/SetProductImage'
import ShowMessage from '~/components/ShowMessage'
import useSetTitle from '~/hooks/useSetTitle'
import FilterOrder from './components/FilterOrder'

import { SplitButton } from 'primereact/splitbutton'
import useQueryOrders from '~/hooks/useQueryOrders'
import { OrderStatus } from './components/FilterOrder/FilterOrder'
import RowVariant from './components/RowVariant'

export default function OrderList() {
    useSetTitle('Danh sách đơn hàng')
    const navigate = useNavigate()
    const queryConfig = useQueryOrders()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)

    const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus | null>(null)
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: orders } = useQuery({
        queryKey: ['orders', queryConfig],
        queryFn: () => ordersApi.getAllOrders(queryConfig as OrderFilters),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    // Row variant
    const variantNameTemplate = useCallback((rowData: OrderDetail) => rowData?.variant.variant_name ?? 0, [])
    const quantityTemplate = useCallback((rowData: OrderDetail) => rowData?.quantity ?? 0, [])
    const imageTemplate = useCallback(
        (rowData: OrderDetail) => <SetProductImage productImages={rowData?.variant?.product_images} />,
        []
    )
    const priceTemplate = useCallback((rowData: OrderDetail) => rowData?.price ?? 0, [])

    const orderCodeTemplate = useCallback((rowData: Order) => {
        return (
            <Link className='text-blue-600' to={`${PATH.ORDER_LIST}/${rowData.id}`}>
                {rowData?.order_code}
            </Link>
        )
    }, [])

    const orderDateTemplate = useCallback((rowData: Order) => formatDate(rowData?.order_date), [])

    const phoneNumberTemplate = useCallback((rowData: Order) => rowData?.phone_number ?? '', [])

    const orderStatusTemplate = useCallback((rowData: Order) => rowData?.status ?? '', [])
    const totalTemplate = useCallback((rowData: Order) => rowData?.shipping_fee ?? 0, [])

    const createMenuItems = (orderId: number) => [
        {
            label: 'Xác nhận đơn hàng',
            icon: 'pi pi-check',
            command: () => {
                console.log('Xác nhận', orderId)
                // Thực hiện hành động xác nhận tại đây
            }
        },
        {
            label: 'Giao cho vận chuyển',
            icon: 'pi pi-truck',
            command: () => {
                console.log('Hủy bỏ', orderId)
                // Thực hiện hành động hủy bỏ tại đây
            }
        },
        {
            label: 'Đã giao hàng (Fake)',
            icon: 'pi pi-gift',
            command: () => {
                console.log('Hủy bỏ', orderId)
                // Thực hiện hành động hủy bỏ tại đây
            }
        },
        {
            label: 'Hủy đơn hàng',
            icon: 'pi pi-times',
            command: () => {
                console.log('Hủy bỏ', orderId)
                // Thực hiện hành động hủy bỏ tại đây
            }
        }
    ]

    const actionTemplate = useCallback((order: Order) => {
        return (
            <SplitButton
                label='Cập nhật trạng thái'
                icon='pi pi-plus'
                text
                severity='warning'
                onClick={() => console.log('Update purchase order...', order)}
                model={createMenuItems(order.id)}
            />
        )
    }, [])

    const allowExpansion = useCallback((rowData: Order) => rowData.order_details!.length > 0, [])

    const rowVariantTemplate = useCallback(
        (data: Order) => {
            return (
                <RowVariant
                    data={data}
                    imageTemplate={imageTemplate}
                    variantNameTemplate={variantNameTemplate}
                    quantityTemplate={quantityTemplate}
                    priceTemplate={priceTemplate}
                />
            )
        },
        [imageTemplate, priceTemplate, quantityTemplate, variantNameTemplate]
    )

    const header = useMemo(
        () => (
            <FilterOrder
                search={search}
                setSearch={setSearch}
                selectedOrderStatus={selectedOrderStatus}
                setSelectedOrderStatus={setSelectedOrderStatus}
            />
        ),
        [search, selectedOrderStatus]
    )

    const selectedHeader = useMemo(
        () => (
            <Fragment>
                <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                    <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                        <FaCheckDouble />
                        Đã chọn {selectedOrders.length} dòng trên trang này
                    </span>
                    <Dropdown
                        style={{ width: '300px' }}
                        className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                        placeholder='Chưa có thao tác trên trang này'
                    />
                </div>
                <div className='text-[14px] font-normal'>
                    <ShowMessage
                        severity='warn'
                        detail='Lưu ý với trường hợp xóa vĩnh viễn chỉ xóa được sản phẩm nào không có bắt kì ràng buộc dữ liệu nào, sau khi xóa dữ liệu sẽ không được khôi phục'
                    />
                </div>
            </Fragment>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedOrders.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedOrders(e.value as Order[])
    }, [])

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.ORDER_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (orders?.data?.pagination?.limit as number) * (orders?.data?.pagination?.total_page as number)
    }, [orders?.data?.pagination?.limit, orders?.data?.pagination?.total_page])

    return (
        <div className='w-full'>
            <DataTable
                value={(orders?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowVariantTemplate}
                dataKey='id'
                header={selectedOrders.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedOrders}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column className='pr-0 w-[35px]' expander={allowExpansion} />
                <Column selectionMode='multiple' className='w-[40px]' />
                <Column header='Mã đơn hàng' body={orderCodeTemplate} />
                <Column header='Ngày đặt hàng' body={orderDateTemplate} />
                <Column header='Số điện thoại' body={phoneNumberTemplate} />
                <Column header='Tổng thanh toán' body={totalTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={orderStatusTemplate} />
                <Column className='w-[25%]' header='Hành động' body={actionTemplate} />
            </DataTable>
            <div className='flex justify-end mt-3'>
                <Paginator
                    style={{ backgroundColor: 'transparent', textAlign: 'right' }}
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 15]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}
