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

import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { Dialog } from 'primereact/dialog'
import { SplitButton } from 'primereact/splitbutton'
import { useForm } from 'react-hook-form'
import { GrPrint } from 'react-icons/gr'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import ghnApi from '~/apis/ghn.api'
import MyButton from '~/components/MyButton'
import MyTextarea from '~/components/MyTextarea'
import ShowMessage from '~/components/ShowMessage'
import API from '~/constants/api'
import MESSAGE from '~/constants/message'
import { ORDER_STATUS } from '~/constants/status'
import useQueryOrders from '~/hooks/useQueryOrders'
import { orderSchema } from '~/schemas/orders.schema'
import ConfirmOrder from './components/ConfirmOrder'
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
    const [message, setMessage] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const [openCancel, setOpenCancel] = useState<boolean>(false)
    const [cancelOrderId, setCancelOrderId] = useState<number>(0)
    const [openConFirmOrder, setOpenConFirmOrder] = useState<boolean>(false)
    const [orderPayload, setOrderPayload] = useState<Order | null>(null)
    const [confirmMessageOrder, setConfirmMessageOrder] = useState<string>('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<{ canceled_reason: string }>({
        resolver: yupResolver(orderSchema)
    })

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

    const printOrderTemplate = useCallback((rowData: Order) => {
        return rowData?.status === ORDER_STATUS.CONFIRMED ? (
            <MyButton onClick={() => handlePrintOrder(rowData)} text severity='secondary'>
                <p className='text-[13.6px] font-medium flex items-center gap-2 uppercase'>
                    <GrPrint />
                    In hóa đơn
                </p>
            </MyButton>
        ) : (
            <Fragment></Fragment>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const trackingCodeTemplate = useCallback(
        (rowData: Order) => (rowData?.tracking_code ? rowData?.tracking_code : 'Chưa tạo đơn'),
        []
    )

    const actionTemplate = useCallback((rowData: Order) => {
        let severity: 'warning' | 'info' | 'contrast' | 'success' | 'danger' | 'secondary' | undefined = undefined

        switch (rowData.status) {
            case ORDER_STATUS.PENDING:
                severity = 'warning'
                break
            case ORDER_STATUS.CONFIRMED:
                severity = 'info'
                break
            case ORDER_STATUS.DELIVERING:
                severity = 'contrast'
                break
            case ORDER_STATUS.DELIVERED:
                severity = 'success'
                break
            case ORDER_STATUS.CANCELLED:
                severity = 'danger'
                break
            case ORDER_STATUS.PAID:
                severity = 'info'
                break
            case ORDER_STATUS.UNPAID:
                severity = 'warning'
                break
            default:
                severity = 'contrast'
        }
        return (
            <SplitButton
                buttonClassName='text-[13px]'
                label={convertOrderStatus(rowData.status).toUpperCase()}
                text
                severity={severity}
                model={createMenuItems(rowData)}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Update
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
            setOpenCancel(false)
        }
    })

    const createMenuItems = (order: Order) => [
        {
            label: 'Xác nhận đơn hàng',
            icon: 'pi pi-check',
            command: () => {
                // updateStatusOrderMutation.mutate({ id: orderId, status: ORDER_STATUS.CONFIRMED })
                setOpenConFirmOrder(true)
                setOrderPayload(order)
            }
        },
        {
            label: 'Giao cho vận chuyển',
            icon: 'pi pi-truck',
            command: () => {
                updateStatusOrderMutation.mutate({ id: order?.id, status: ORDER_STATUS.DELIVERING })
            }
        },
        {
            label: 'Đã giao hàng (Fake)',
            icon: 'pi pi-gift',
            command: () => {
                updateStatusOrderMutation.mutate({ id: order?.id, status: ORDER_STATUS.DELIVERED })
            }
        },
        {
            label: 'Hủy đơn hàng',
            icon: 'pi pi-times',
            command: () => {
                setOpenCancel(true)
                setCancelOrderId(order?.id)
            }
        }
    ]

    // Cancel order
    const onSubmit = handleSubmit((data) => {
        updateStatusOrderMutation.mutate({
            id: cancelOrderId,
            status: ORDER_STATUS.CANCELLED,
            canceled_reason: data.canceled_reason
        })
        setOpenCancel(false)
    })

    // Print order
    const genTokenMutation = useMutation({
        mutationFn: (data: { order_codes: string[] }) => ghnApi.genToken(data),
        onSuccess: (data) => {
            window.open(`${API.PRINT_ORDER}?token=${data?.data?.data?.token}`, '_blank')
        },
        onError: () => {
            toast.error('Đã có lỗi xảy ra vui lòng kiểm tra lại')
        }
    })
    const handlePrintOrder = (order: Order) => {
        genTokenMutation.mutate({ order_codes: [order?.tracking_code] })
    }
    return (
        <div className='w-full'>
            <ConfirmOrder
                setMessage={setMessage}
                setMessageConfirmOrder={setConfirmMessageOrder}
                orderPayload={orderPayload as Order}
                openConfirmOrder={openConFirmOrder}
                setOpenConfirmOrder={setOpenConFirmOrder}
            />
            <Dialog
                header={<p className='font-medium text-gray-900'>Hủy đơn hàng</p>}
                visible={openCancel}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!openCancel) return
                    setOpenCancel(false)
                    reset()
                }}
            >
                <div className='m-0'>
                    <form onSubmit={onSubmit}>
                        <MyTextarea
                            register={register}
                            errors={errors}
                            placeholder='Nhập ghi chú'
                            className='w-full py-0 pt-3 font-normal flex items-center'
                            classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                            styleMessage={{ fontSize: '13.6px' }}
                            name='canceled_reason'
                        />
                        <div className='flex justify-end gap-4  pt-6'>
                            <MyButton
                                onClick={() => {
                                    setOpenCancel(false)
                                    reset()
                                }}
                                className='rounded-[3px] h-9'
                                outlined
                            >
                                <p className='font-semibold text-[14px]'>Thoát</p>
                            </MyButton>

                            <MyButton
                                loading={updateStatusOrderMutation.isPending}
                                type='submit'
                                className='rounded-[3px] h-9 w-36'
                            >
                                <p className='font-semibold text-[14px]'>Xác nhận</p>
                            </MyButton>
                        </div>
                    </form>
                </div>
            </Dialog>
            {message && <ShowMessage severity='warn' detail={message} />}
            {confirmMessageOrder && <ShowMessage severity='success' detail={confirmMessageOrder} />}
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
                <Column header='Mã vận đơn' body={trackingCodeTemplate} />
                <Column header='Ngày đặt hàng' body={orderDateTemplate} />
                <Column header='Số điện thoại' body={phoneNumberTemplate} />
                <Column className='pl-0 w-[20%]' header='Trạng thái' body={actionTemplate} />
                <Column className='pl-0' field='status' header='Thao tác' body={printOrderTemplate} />
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
