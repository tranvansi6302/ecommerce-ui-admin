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

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import PATH from '~/constants/path'
import { convertOrderStatus, formatDate } from '~/utils/format'

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { FaCheckDouble } from 'react-icons/fa'
import { Order, OrderDetail, OrderFilters } from '~/@types/order'
import ordersApi from '~/apis/orders.api'
import SetProductImage from '~/components/SetProductImage'
import useSetTitle from '~/hooks/useSetTitle'
import FilterOrder from './components/FilterOrder'

import { SplitButton } from 'primereact/splitbutton'
import MyButton from '~/components/MyButton'
import useQueryOrders from '~/hooks/useQueryOrders'
import { OrderStatus } from './components/FilterOrder/FilterOrder'
import RowVariant from './components/RowVariant'
import { ORDER_STATUS } from '~/constants/status'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { MessageResponse } from '~/@types/util'
import MESSAGE from '~/constants/message'
import ShowMessage from '~/components/ShowMessage'

export default function OrderList() {
    useSetTitle('Danh sách đơn hàng')
    const navigate = useNavigate()
    const queryConfig = useQueryOrders()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus | null>(null)
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: orders, refetch } = useQuery({
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

    const orderStatusTemplate = useCallback((rowData: Order) => {
        let statusColorClass = ''
        switch (rowData.status) {
            case ORDER_STATUS.PENDING:
                statusColorClass = 'text-yellow-600'
                break
            case ORDER_STATUS.CONFIRMED:
                statusColorClass = 'text-blue-600'
                break
            case ORDER_STATUS.DELIVERING:
                statusColorClass = 'text-green-600'
                break
            case ORDER_STATUS.DELIVERED:
                statusColorClass = 'text-gray-600'
                break
            case ORDER_STATUS.CANCELLED:
                statusColorClass = 'text-red-600'
                break
            case ORDER_STATUS.PAID:
                statusColorClass = 'text-green-600'
                break
            case ORDER_STATUS.UNPAID:
                statusColorClass = 'text-orange-800'
                break
            default:
                statusColorClass = 'text-gray-500'
        }
        return (
            <MyButton text className={statusColorClass}>
                <p className='text-[13.6px] font-medium'>{convertOrderStatus(rowData.status).toUpperCase()}</p>
            </MyButton>
        )
    }, [])
    const totalTemplate = useCallback((rowData: Order) => rowData?.shipping_fee ?? 0, [])

    const updateStatusOrderMutation = useMutation({
        mutationFn: (body: { id: number; status: string; canceled_reason?: string }) =>
            ordersApi.updateStatusOrder(body.id, body),
        onSuccess: (data) => {
            toast.success(data?.data?.message)
            refetch()
        },
        onError: (error) => {
            console.log(error)
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            setMessage(errorResponse?.message ?? '')
            toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
        }
    })

    const createMenuItems = (orderId: number) => [
        {
            label: 'Xác nhận đơn hàng',
            icon: 'pi pi-check',
            command: () => {
                updateStatusOrderMutation.mutate({ id: orderId, status: ORDER_STATUS.CONFIRMED })
            }
        },
        {
            label: 'Giao cho vận chuyển',
            icon: 'pi pi-truck',
            command: () => {
                updateStatusOrderMutation.mutate({ id: orderId, status: ORDER_STATUS.DELIVERING })
            }
        },
        {
            label: 'Đã giao hàng (Fake)',
            icon: 'pi pi-gift',
            command: () => {
                updateStatusOrderMutation.mutate({ id: orderId, status: ORDER_STATUS.DELIVERED })
            }
        },
        {
            label: 'Hủy đơn hàng',
            icon: 'pi pi-times',
            command: () => {
                updateStatusOrderMutation.mutate({ id: orderId, status: ORDER_STATUS.CANCELLED })
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
            {message && <ShowMessage severity='warn' detail={message} />}
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
                <Column className='pl-0 w-[25%]' header='Hành động' body={actionTemplate} />
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
