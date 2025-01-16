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
import { convertReturnOrderStatus, formatCurrencyVND, formatDate } from '~/utils/format'

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { FaCheckDouble } from 'react-icons/fa'
import { Order } from '~/@types/order'
import useSetTitle from '~/hooks/useSetTitle'

import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { Dialog } from 'primereact/dialog'
import { SplitButton } from 'primereact/splitbutton'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ReturnOrderFilter, ReturnOrderResponse } from '~/@types/returnOrder'
import { MessageResponse } from '~/@types/util'
import { returnOrderApi } from '~/apis/returnOrder.api'
import MyButton from '~/components/MyButton'
import MyTextarea from '~/components/MyTextarea'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import { RETURN_ORDER_STATUS } from '~/constants/status'
import useQueryOrders from '~/hooks/useQueryOrders'
import { rejectOrderSchema, RejectOrderSchemaType } from '~/schemas/orders.schema'
import FilterReturnOrder, { ReturnOrderStatusType } from './components/FilterOrder/FilterReturnOrder'
import RowVariantReturnOrder from './components/RowVariantReturnOrder'
export default function ReturnOrders() {
    useSetTitle('Đơn hàng đổi trả')
    const navigate = useNavigate()
    const queryConfig = useQueryOrders()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<ReturnOrderStatusType | null>(null)
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const [openReject, setOpenReject] = useState<boolean>(false)
    const [rejectOrderId, setRejectOrderId] = useState<number | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RejectOrderSchemaType>({
        resolver: yupResolver(rejectOrderSchema)
    })

    const { data: returnOrders, refetch } = useQuery({
        queryKey: ['return-orders', queryConfig],
        queryFn: () => returnOrderApi.getList(queryConfig as ReturnOrderFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    // Row variant
    const sizeColorOld = useCallback((rowData: ReturnOrderResponse) => {
        return `${rowData?.old_variant?.size} - ${rowData?.old_variant?.color}`
    }, [])
    const sizeColorNew = useCallback((rowData: ReturnOrderResponse) => {
        return `${rowData?.variant?.size} - ${rowData?.variant?.color}`
    }, [])
    const priceOld = useCallback((rowData: ReturnOrderResponse) => formatCurrencyVND(rowData?.old_price) ?? '', [])
    const priceNew = useCallback((rowData: ReturnOrderResponse) => formatCurrencyVND(rowData?.price) ?? '', [])

    const returnOrderCodeTemplate = useCallback((rowData: ReturnOrderResponse) => {
        return (
            <Link className='text-blue-600' to={`${PATH.ORDER_LIST}/${rowData.order_code}`}>
                {rowData?.order_code}
            </Link>
        )
    }, [])

    const returnOrderProductTemplate = useCallback((rowData: ReturnOrderResponse) => {
        return (
            <div>
                <p>{rowData?.variant?.product_name}</p>
            </div>
        )
    }, [])

    const returnOrderDateTemplate = useCallback((rowData: ReturnOrderResponse) => formatDate(rowData?.created_at), [])

    const statusTemplate = useCallback((rowData: ReturnOrderResponse) => {
        let severity: 'warning' | 'info' | 'contrast' | 'success' | 'danger' | 'secondary' | undefined = undefined

        switch (rowData.return_status) {
            case RETURN_ORDER_STATUS.REQUESTED:
                severity = 'warning'
                break
            case RETURN_ORDER_STATUS.ACCEPTED:
                severity = 'success'
                break
            case RETURN_ORDER_STATUS.REJECTED:
                severity = 'danger'
                break

            default:
                severity = 'contrast'
        }
        return (
            <SplitButton
                buttonClassName='text-[13px]'
                label={convertReturnOrderStatus(rowData.return_status).toUpperCase()}
                text
                severity={severity}
                model={createMenuItems(rowData)}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const actionTemplate = useCallback((rowData: ReturnOrderResponse) => {
        return (
            <Link to={`${PATH.RETURN_ORDERS}/${rowData.id}`}>
                <p className='text-blue-600 text-[14px] font-semibold hover:underline'>CHI TIẾT</p>
            </Link>
        )
    }, [])

    const rowVariantTemplate = useCallback(
        (data: ReturnOrderResponse) => {
            console.log(data)
            return (
                <RowVariantReturnOrder
                    data={data}
                    sizeColorOld={sizeColorOld}
                    sizeColorNew={sizeColorNew}
                    priceOld={priceOld}
                    priceNew={priceNew}
                />
            )
        },
        [sizeColorOld, sizeColorNew, priceOld, priceNew]
    )

    const header = useMemo(
        () => (
            <FilterReturnOrder
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
        return (returnOrders?.data?.pagination?.limit as number) * (returnOrders?.data?.pagination?.total_page as number)
    }, [returnOrders?.data?.pagination?.limit, returnOrders?.data?.pagination?.total_page])

    // Update
    const updateStatusReturnOrderMutation = useMutation({
        mutationFn: (body: { order_return_id: number; status: string; rejected_reason?: string }) =>
            returnOrderApi.updateStatus(body),
        onSuccess: (data) => {
            toast.success(data?.data?.message)
            refetch()
            setOpenReject(false)
        },
        onError: (error) => {
            console.log(error)
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            setMessage(errorResponse?.message ?? '')
            toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            setOpenReject(false)
        }
    })

    const createMenuItems = (order: ReturnOrderResponse) => [
        {
            label: 'Xác nhận đổi trả',
            icon: 'pi pi-check',
            command: () => {
                console.log({
                    order_return_id: order?.id,
                    status: RETURN_ORDER_STATUS.ACCEPTED
                })
                updateStatusReturnOrderMutation.mutate({
                    order_return_id: order?.id,
                    status: RETURN_ORDER_STATUS.ACCEPTED
                })
            }
        },
        {
            label: 'Từ chối đổi trả',
            icon: 'pi pi-times',
            command: () => {
                setOpenReject(true)
                setRejectOrderId(order?.id)
            }
        }
    ]

    // Cancel order
    const onSubmit = handleSubmit((data) => {
        updateStatusReturnOrderMutation.mutate({
            order_return_id: rejectOrderId as number,
            status: RETURN_ORDER_STATUS.REJECTED,
            rejected_reason: data.rejected_reason
        })
        setOpenReject(false)
        reset()
    })

    return (
        <div className='w-full'>
            <Dialog
                header={<p className='font-medium text-gray-900'>Từ chối đổi trả</p>}
                visible={openReject}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!openReject) return
                    setOpenReject(false)
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
                            name='rejected_reason'
                            label='Lý do từ chối'
                        />
                        <div className='flex justify-end gap-4  pt-6'>
                            <MyButton
                                onClick={() => {
                                    setOpenReject(false)
                                    reset()
                                }}
                                className='rounded-[3px] h-9'
                                outlined
                            >
                                <p className='font-semibold text-[14px]'>Thoát</p>
                            </MyButton>

                            <MyButton
                                loading={updateStatusReturnOrderMutation.isPending}
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

            <DataTable
                value={(returnOrders?.data.result as unknown as DataTableValueArray) ?? []}
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
                <Column className='pr-0 w-[35px]' expander={true} />
                <Column selectionMode='multiple' className='w-[40px]' />
                <Column header='Mã đơn hàng' body={returnOrderCodeTemplate} />
                <Column className='pl-0 w-[40%]' header='Sản phẩm' body={returnOrderProductTemplate} />
                <Column header='Ngày yêu cầu' body={returnOrderDateTemplate} />

                <Column className='pl-0 w-[20%]' header='Trạng thái' body={statusTemplate} />
                <Column className='w-[10%]' header='Hành động' body={actionTemplate} />
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
