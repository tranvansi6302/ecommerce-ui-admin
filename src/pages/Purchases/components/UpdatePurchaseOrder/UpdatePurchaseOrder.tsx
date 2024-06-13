import { Column } from 'primereact/column'
import { DataTable, DataTableValueArray } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegCircleUser } from 'react-icons/fa6'
import { GoCodeSquare } from 'react-icons/go'
import { MdAutoAwesomeMotion, MdMyLocation, MdOutlineMailOutline, MdOutlinePhoneForwarded } from 'react-icons/md'
import DefaultProductImage from '~/components/DefaultProductImage'
import MyButton from '~/components/MyButton'
import { convertPurchaseOrderStatus, formatCurrencyVND, formatDate } from '~/utils/format'

import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dialog } from 'primereact/dialog'
import { MenuItem } from 'primereact/menuitem'
import { SplitButton } from 'primereact/splitbutton'
import { FaRegEdit } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PurchaseDetails } from '~/@types/purchase'
import { MessageResponse } from '~/@types/util'
import purchasesApi, { UpdatePurchaseOrderRequest } from '~/apis/purchases.api'
import MyInput from '~/components/MyInput'
import MyTextarea from '~/components/MyTextarea'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import PurchaseOrderInfo from '../PurchaseOrderInfo'
import SupplierInfo from '../SupplierInfo'
import { PURCHASE_ORDER_STATUS } from '~/constants/status'
import useSetTitle from '~/hooks/useSetTitle'

export default function UpdatePurchaseOrder() {
    useSetTitle('Cập nhật đơn hàng')
    const navigate = useNavigate()
    const { id: purchaseOrderId } = useParams<{ id: string }>()
    const [globalFilter] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [quantityReceived, setQuantityReceived] = useState<{ [key: number]: number }>({})
    const [openNote, setOpenNote] = useState<boolean>(false)
    const [openReason, setOpenReason] = useState<boolean>(false)
    const [reason, setReason] = useState<string>('')
    const [noteVariant, setNoteVariant] = useState<{ [key: number | string]: string | string }>({})
    const [noteRowId, setNoteRowId] = useState<number>(0)
    const { register, setValue } = useForm()

    const { data: purchaseOrder } = useQuery({
        queryKey: ['purchaseOrder', purchaseOrderId],
        queryFn: () => purchasesApi.getPurchaseOrderById(Number(purchaseOrderId)),
        enabled: !!purchaseOrderId
    })

    const handleAutoReceivedQuantity = useCallback(() => {
        const updatedQuantities = purchaseOrder?.data.result.purchase_details.reduce(
            (acc, row) => {
                acc[row.variant.id] = row.quantity
                return acc
            },
            {} as { [key: number]: number }
        )

        setQuantityReceived(updatedQuantities || {})
        toast.success(MESSAGE.AUTO_RECEIVED_QUANTITY_SUCCESS)
    }, [purchaseOrder?.data.result.purchase_details])

    // Render
    const handleQuantityChange = (id: number, value: number) => {
        setQuantityReceived((prev) => ({ ...prev, [id]: value }))
    }

    const variantNumberTemplate = useCallback((_: any, index: any) => index.rowIndex + 1, [])
    const variantImageTemplate = useCallback(
        () => (
            <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                <DefaultProductImage height='28px' />
            </div>
        ),
        []
    )
    const variantNameTemplate = useCallback((rowData: PurchaseDetails) => {
        return (
            <div className='font-normal text-gray-800 flex flex-col gap-1'>
                <p className='text-[13.6px] '>{rowData.variant.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.variant.sku}</p>
            </div>
        )
    }, [])

    const variantReceivedTemplate = useCallback(
        (rowData: PurchaseDetails) => {
            return purchaseOrder?.data.result.status === PURCHASE_ORDER_STATUS.CANCELLED ||
                purchaseOrder?.data.result.status === PURCHASE_ORDER_STATUS.COMPLETED ? (
                (rowData.quantity_received as number)
            ) : (
                <MyInput
                    register={register}
                    className='w-28 h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                    name={`quantity_${rowData.variant.id}`}
                    type='number'
                    value={quantityReceived[rowData.variant.id] || 0}
                    onChange={(e) => handleQuantityChange(rowData.variant.id, parseInt(e.target.value))}
                />
            )
        },
        [purchaseOrder?.data.result.status, quantityReceived, register]
    )

    const variantActionTemplate = useCallback(
        (rowData: PurchaseDetails) => (
            <div className='flex items-center'>
                <MyButton onClick={() => handleOpenNote(rowData.variant.id)} text severity='success' className='w-10 mb-[2px]'>
                    <p>
                        <FaRegEdit fontSize='20px' />
                    </p>
                </MyButton>
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const variantQuantityTemplate = useCallback((rowData: PurchaseDetails) => rowData.quantity, [])

    const variantPriceTemplate = useCallback((rowData: PurchaseDetails) => rowData.purchase_price, [])

    const variantTotalPriceTemplate = useCallback(
        (rowData: PurchaseDetails) => formatCurrencyVND(rowData.quantity * rowData.purchase_price),
        []
    )

    const header = useMemo(
        () => (
            <div className='text-right'>
                <MyButton onClick={handleAutoReceivedQuantity} outlined type='button' className='rounded-sm'>
                    <MdAutoAwesomeMotion fontSize='20px' />
                    <p className='text-[14px] font-normal ml-2'>Nhận số lượng nhanh</p>
                </MyButton>
            </div>
        ),
        [handleAutoReceivedQuantity]
    )

    // Total
    const quantityTotal = useCallback(() => {
        return purchaseOrder?.data.result.purchase_details.reduce((total, row) => total + row.quantity, 0)
    }, [purchaseOrder?.data.result.purchase_details])

    const totalPrice = useCallback(() => {
        return (
            purchaseOrder?.data.result.purchase_details.reduce((total, row) => total + row.quantity * row.purchase_price, 0) || 0
        )
    }, [purchaseOrder?.data.result.purchase_details])

    // Note
    const handleOpenNote = (id: number) => {
        setOpenNote(true)
        setNoteRowId(id)
    }

    const handleNoteChange = (id: number, value: string) => {
        setNoteVariant((prev) => ({ ...prev, [id]: value }))
    }

    useEffect(() => {
        setValue(
            `note_${noteRowId}`,
            purchaseOrder?.data.result.purchase_details.find((row) => row.variant.id === noteRowId)?.note
        )
    }, [noteRowId, noteVariant, purchaseOrder?.data.result.purchase_details, setValue])

    const updatePurchaseOrderMutation = useMutation({
        mutationFn: (payload: { id: number; data: UpdatePurchaseOrderRequest }) =>
            purchasesApi.updatePurchase(payload.id, payload.data)
    })

    const items: MenuItem[] = [
        {
            label: 'Xác nhận',
            icon: 'pi pi-check',
            command: () => {
                setMessage('')
                const data: UpdatePurchaseOrderRequest = {
                    status: PURCHASE_ORDER_STATUS.COMPLETED,
                    purchase_details: purchaseOrder?.data.result.purchase_details.map((row) => ({
                        variant_id: row.variant.id,
                        quantity_received: quantityReceived[row.variant.id] || 0,
                        note: noteVariant[row.variant.id] || row.note
                    }))
                }
                const body = {
                    id: Number(purchaseOrderId),
                    data
                }
                updatePurchaseOrderMutation.mutate(body, {
                    onSuccess: () => {
                        toast.success(MESSAGE.UPDATE_PURCHASE_ORDER_SUCCESS)
                        navigate(PATH.PURCHASE_LIST)
                    },
                    onError: (error) => {
                        const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                        setMessage(errorResponse?.message ?? '')
                        toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
                    }
                })
            }
        },
        {
            label: 'Hủy bỏ',
            icon: 'pi pi-times',
            command: () => {
                setOpenReason(true)
            }
        }
    ]

    const confirmCancel = () => {
        setMessage('')
        const data: UpdatePurchaseOrderRequest = {
            status: PURCHASE_ORDER_STATUS.CANCELLED,
            purchase_details: [],
            cancel_reason: reason
        }
        const body = {
            id: Number(purchaseOrderId),
            data
        }

        updatePurchaseOrderMutation.mutate(body, {
            onSuccess: () => {
                toast.success(MESSAGE.UPDATE_PURCHASE_ORDER_SUCCESS)
                navigate(PATH.PURCHASE_LIST)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
        setOpenReason(false)
    }

    return (
        <div>
            {message && <ShowMessage severity='warn' detail={message} />}
            <Dialog
                header={<p className='font-medium text-gray-900'>Ghi chú</p>}
                visible={openNote}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!openNote) return
                    setOpenNote(false)
                }}
            >
                <div className='m-0'>
                    <div>
                        <MyTextarea
                            register={register}
                            placeholder='Nhập ghi chú'
                            className='w-full py-0 font-normal flex items-center'
                            classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                            onChange={(e) => handleNoteChange(noteRowId, e.target.value)}
                            value={noteVariant[noteRowId]}
                            name={`note_${noteRowId}`}
                        />
                        <div className='flex justify-end gap-4  pt-6'>
                            <MyButton onClick={() => setOpenNote(false)} className='rounded-[3px] h-9' outlined>
                                <p className='font-semibold text-[14px]'>Thoát</p>
                            </MyButton>
                            <MyButton onClick={() => setOpenNote(false)} className='rounded-[3px] h-9 w-36'>
                                <p className='font-semibold text-[14px]'>Xác nhận</p>
                            </MyButton>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog
                header={<p className='font-medium text-gray-900'>Lý do hủy đơn</p>}
                visible={openReason}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!openReason) return
                    setOpenReason(false)
                }}
            >
                <div className='m-0'>
                    <div>
                        <MyTextarea
                            register={register}
                            placeholder='Nhập lý do'
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
                            name='cancel_reason'
                        />
                        <MyButton onClick={confirmCancel}>Xác nhận</MyButton>
                    </div>
                </div>
            </Dialog>
            <div className='card w-full'>
                <div className='flex gap-6'>
                    <div className='w-[60%]'>
                        <div className='bg-white px-5 py-5 h-full'>
                            <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin nhà cung cấp</h3>
                            <Divider />

                            <div className='card border border-dashed rounded-sm p-5 h-auto'>
                                <div className='card-body text-gray-700  flex flex-col gap-2 '>
                                    <SupplierInfo
                                        title='Tên nhà cung cấp'
                                        icon={<FaRegCircleUser />}
                                        value={purchaseOrder?.data.result.supplier.name ?? ''}
                                    />
                                    <SupplierInfo
                                        title='Mã nhà cung cấp'
                                        icon={<GoCodeSquare />}
                                        value={purchaseOrder?.data.result.supplier.tax_code ?? ''}
                                    />
                                    <SupplierInfo
                                        title='Email'
                                        icon={<MdOutlineMailOutline />}
                                        value={purchaseOrder?.data.result.supplier.email ?? ''}
                                    />
                                    <SupplierInfo
                                        title='Số điện thoại'
                                        icon={<MdOutlinePhoneForwarded />}
                                        value={purchaseOrder?.data.result.supplier.phone_number ?? ''}
                                    />
                                    <SupplierInfo
                                        title='Địa chỉ'
                                        icon={<MdMyLocation />}
                                        value={purchaseOrder?.data.result.supplier.address ?? ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-[40%]'>
                        <div className='bg-white px-5 py-5 h-full'>
                            <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin đơn nhập hàng</h3>
                            <Divider />
                            <div className='card border border-dashed rounded-sm p-5 h-auto'>
                                <div className='card-body text-gray-700  flex flex-col gap-2 '>
                                    <PurchaseOrderInfo
                                        title='Mã đơn hàng'
                                        value={purchaseOrder?.data.result.purchase_order_code ?? ''}
                                    />
                                    <PurchaseOrderInfo
                                        title='Ngày đặt hàng'
                                        value={formatDate(purchaseOrder?.data.result.purchase_order_date ?? '')}
                                    />
                                    <PurchaseOrderInfo title='Người đặt hàng' value='Admin' />
                                    <PurchaseOrderInfo
                                        title='Trạng thái'
                                        value={convertPurchaseOrderStatus((purchaseOrder?.data.result.status as string) || '')}
                                    />
                                    <PurchaseOrderInfo title='Số lượng' value={quantityTotal()?.toString() || ''} />
                                    <PurchaseOrderInfo title='Tổng tiền' value={formatCurrencyVND(totalPrice())} />
                                    <PurchaseOrderInfo title='Ghi chú' value={purchaseOrder?.data.result.note || ''} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6'>
                    <div className='bg-white px-5 py-5'>
                        <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin sản phẩm</h3>
                        {message && <ShowMessage severity='warn' detail={message} />}
                        <div className='my-4'></div>
                        <DataTable
                            value={(purchaseOrder?.data.result.purchase_details as unknown as DataTableValueArray) ?? []}
                            dataKey='variant.id'
                            header={
                                purchaseOrder?.data.result.status === PURCHASE_ORDER_STATUS.COMPLETED ||
                                purchaseOrder?.data.result.status === PURCHASE_ORDER_STATUS.CANCELLED
                                    ? null
                                    : header
                            }
                            tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                            className='shadow'
                            globalFilter={globalFilter}
                        >
                            <Column body={variantNumberTemplate} header='STT' />
                            <Column body={variantImageTemplate} header='Ảnh' />
                            <Column body={variantNameTemplate} header='Tên sản phẩm' />
                            <Column body={variantQuantityTemplate} header='Số lượng' />
                            <Column body={variantPriceTemplate} header='Giá nhập' />
                            <Column body={variantTotalPriceTemplate} header='Thành tiền' />
                            <Column className='w-[10%]' body={variantReceivedTemplate} header='Số lượng nhận' />
                            <Column body={variantActionTemplate} className='w-[10%]' header='Ghi chú' />
                        </DataTable>
                    </div>
                </div>
            </div>

            <div className='flex justify-end gap-4 pb-14 pt-6'>
                <Link to={PATH.PURCHASE_LIST}>
                    <MyButton className='rounded-[3px] h-9' outlined>
                        <p className='font-semibold text-[14px]'>Thoát</p>
                    </MyButton>
                </Link>
                <SplitButton
                    label='Cập nhật trạng thái'
                    icon='pi pi-plus'
                    onClick={() => console.log('Update purchase order...')}
                    model={items}
                />
            </div>
        </div>
    )
}
