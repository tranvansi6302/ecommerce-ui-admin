import { useMutation, useQuery } from '@tanstack/react-query'
import { Fragment, useMemo, useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { RiSecurePaymentLine } from 'react-icons/ri'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ordersApi from '~/apis/orders.api'

import { Order } from '~/@types/order'
import { ORDER_STATUS } from '~/constants/status'
import { convertOrderStatus, convertPaymentMethod, formatCurrencyVND, formatDate, formatDateFull } from '~/utils/format'
import OrderStep from '../OrderStep'
import useSetTitle from '~/hooks/useSetTitle'
import { SplitButton } from 'primereact/splitbutton'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { MessageResponse } from '~/@types/util'
import MESSAGE from '~/constants/message'
import ShowMessage from '~/components/ShowMessage'
import { Dialog } from 'primereact/dialog'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderSchema } from '~/schemas/orders.schema'
import MyTextarea from '~/components/MyTextarea'
import MyButton from '~/components/MyButton'

export default function OrderDetail() {
    const navigate = useNavigate()
    useSetTitle('Chi tiết đơn hàng')
    const [message, setMessage] = useState<string>('')
    const { id: orderId } = useParams<{ id: string }>()
    const { data, refetch } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => ordersApi.getOrderById(Number(orderId)),
        enabled: !!orderId
    })
    const [openCancel, setOpenCancel] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<{ canceled_reason: string }>({
        resolver: yupResolver(orderSchema)
    })

    const order = data?.data.result as Order

    const handleBack = () => {
        navigate(-1)
    }

    const totalProduct = useMemo(() => {
        return order?.order_details.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    }, [order])

    const totalCheckout = useMemo(() => {
        return totalProduct + order?.shipping_fee - order?.discount_order - order?.discount_shipping
    }, [order?.discount_order, order?.discount_shipping, order?.shipping_fee, totalProduct])

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

    const createMenuItems = () => [
        {
            label: 'Xác nhận đơn hàng',
            icon: 'pi pi-check',
            command: () => {
                updateStatusOrderMutation.mutate({ id: Number(orderId), status: ORDER_STATUS.CONFIRMED })
            }
        },
        {
            label: 'Giao cho vận chuyển',
            icon: 'pi pi-truck',
            command: () => {
                updateStatusOrderMutation.mutate({ id: Number(orderId), status: ORDER_STATUS.DELIVERING })
            }
        },
        {
            label: 'Đã giao hàng (Fake)',
            icon: 'pi pi-gift',
            command: () => {
                updateStatusOrderMutation.mutate({ id: Number(orderId), status: ORDER_STATUS.DELIVERED })
            }
        },
        {
            label: 'Hủy đơn hàng',
            icon: 'pi pi-times',
            command: () => {
                setOpenCancel(true)
            }
        }
    ]

    const onSubmit = handleSubmit((data) => {
        updateStatusOrderMutation.mutate({
            id: Number(orderId),
            status: ORDER_STATUS.CANCELLED,
            canceled_reason: data.canceled_reason
        })
        setOpenCancel(false)
    })
    return (
        <Fragment>
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
            <div className='rounded-sm  pb-10  min-h-[100vh] md:pb-20'>
                <div className='border-b border-b-gray-200 py-6 flex items-center justify-between px-2 md:px-7 bg-white'>
                    <button onClick={handleBack} className='flex items-center gap-1 uppercase text-gray-500'>
                        <IoChevronBack />
                        Trở lại
                    </button>

                    <div className='flex items-center text-[14px]'>
                        <div className='uppercase text-text-primary'>Mã đơn hàng: {order?.order_code}</div>
                        <div className='w-[1px] h-[15px] bg-gray-400 mx-4'></div>
                        <div>
                            <SplitButton
                                label={convertOrderStatus(order?.status as keyof typeof ORDER_STATUS).toUpperCase()}
                                text
                                buttonClassName='text-[13px]'
                                severity='info'
                                style={{ textTransform: 'capitalize' }}
                                onClick={() => console.log('Update purchase order...', order)}
                                model={createMenuItems()}
                            />
                        </div>
                    </div>
                </div>
                <div className='bg-white'>{message && <ShowMessage severity='warn' detail={message} />}</div>
                {order?.status !== ORDER_STATUS.CANCELLED ? (
                    <OrderStep order={order} />
                ) : (
                    <div className=''>
                        <div className='py-12 bg-red-50 px-6'>
                            <p className='text-red-600 capitalize text-[20px]'>Đã hủy đơn hàng</p>
                            <p className='mt-2'>vào lúc {formatDate(order.canceled_date)}</p>
                        </div>
                        <div className='px-6 bg-white'>
                            <p className='text-[14px] text-gray-500 my-2 py-6 text-text-primary'>
                                Lý do hủy đơn hàng: {order.canceled_reason}
                            </p>
                        </div>
                    </div>
                )}

                <div className='line-order'></div>
                {/* Info order */}
                <div className='px-7 pt-12 flex gap-14  bg-white py-6'>
                    <div className='w-1/2'>
                        <h2 className='capitalize text-lg'>Địa chỉ nhận hàng</h2>
                        <div className='mt-4'>
                            <h5 className='text-text-primary'>Trần Văn Sĩ</h5>
                            <p className='mt-2 text-[12px]'>(+84) 877751514</p>
                            <p className='mt-2 text-[12px] text-gray-500 leading-5'>{order?.address}</p>
                        </div>
                    </div>
                    <div className='w-[0.5px] h-[150px] bg-gray-200'></div>
                    <div className='w-1/2'>
                        <h2 className='capitalize text-lg'>Thông tin đơn hàng</h2>
                        <div className='mt-4'>
                            <h5 className='text-text-primary'>Ngày đặt hàng: {formatDateFull(order?.order_date)}</h5>
                            <p className='mt-2 text-[12px] leading-5'>Ghi chú: {order?.note || 'Không có'}</p>
                        </div>
                    </div>
                </div>

                {/* Order Detail Product */}
                <div className='p-7 bg-white mt-4'>
                    <div className='border-t-[1px]'>
                        {order &&
                            order?.order_details?.map((orderDetail) => (
                                <div key={orderDetail.variant.id} className='border-t-[1px]'>
                                    <div className='my-6 flex justify-between'>
                                        <div className='w-[70%] flex gap-1'>
                                            <div className='w-20 h-20 flex-shrink-0'>
                                                <img
                                                    className='w-full h-full object-cover'
                                                    src={orderDetail?.variant?.product_images[0].url}
                                                    alt='product'
                                                />
                                            </div>
                                            <div className='flex-grow px-2 pt-1 pb-2 text-left text-[14px] flex flex-col gap-1'>
                                                <Link to={`123`} className='text-left line-clamp-1'>
                                                    {orderDetail.variant.product_name}
                                                </Link>
                                                <p className='text-[14px] text-gray-500'>
                                                    Phân loại: {orderDetail.variant.color} - {orderDetail.variant.size}
                                                </p>
                                                <span>x{orderDetail.quantity}</span>
                                            </div>
                                        </div>
                                        <div className='w-[30%] flex flex-col  text-[15px] gap-2 px-6'>
                                            <span className='text-blue-600 text-end inline-block'>
                                                {formatCurrencyVND(orderDetail.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Total */}
                <div className=' bg-white'>
                    <div className='px-7 bg-white'>
                        <div className='flex justify-end h-[48px] items-center px-6 border-t'>
                            <h2 className='text-[12px] text-gray-400 w-[20%] border-r justify-end px-4 h-full flex items-center'>
                                Tổng tiền hàng
                            </h2>
                            <h2 className='text-[14px] text-text-primary text-end w-[20%]'>{formatCurrencyVND(totalProduct)}</h2>
                        </div>
                        {order?.status !== ORDER_STATUS.CANCELLED && (
                            <Fragment>
                                <div className='flex justify-end h-[48px] items-center px-6  border-t'>
                                    <h2 className='text-[12px] text-gray-400 w-[20%] border-r justify-end px-4 h-full flex items-center'>
                                        Phí vận chuyển
                                    </h2>
                                    <h2 className='text-[14px] text-text-primary text-end w-[20%]'>
                                        {formatCurrencyVND(order?.shipping_fee)}
                                    </h2>
                                </div>
                                <div className='flex justify-end h-[48px] items-center px-6  border-t'>
                                    <h2 className='text-[12px] text-gray-400 w-[20%] border-r justify-end px-4 h-full flex items-center'>
                                        Giảm giá phí vận chuyển
                                    </h2>
                                    <h2 className='text-[14px] text-text-primary text-end w-[20%]'>
                                        {formatCurrencyVND(order?.discount_shipping)}
                                    </h2>
                                </div>
                                <div className='flex justify-end h-[48px] items-center px-6  border-t'>
                                    <h2 className='text-[12px] text-gray-400 w-[20%] border-r justify-end px-4 h-full flex items-center'>
                                        Giảm giá
                                    </h2>
                                    <h2 className='text-[14px] text-text-primary text-end w-[20%]'>
                                        {formatCurrencyVND(order?.discount_order || 0)}
                                    </h2>
                                </div>
                                <div className='flex justify-end h-[48px] items-center px-6  border-t'>
                                    <h2 className='text-[12px] text-gray-400 w-[20%] border-r justify-end px-4 h-full flex items-center'>
                                        Thành tiền
                                    </h2>
                                    <h2 className='text-[24px] text-blue-600 text-end w-[20%]'>
                                        {formatCurrencyVND(totalCheckout || 0)}
                                    </h2>
                                </div>
                            </Fragment>
                        )}
                        <div className='flex justify-end h-[48px] items-center px-6  border-t'>
                            <h2 className='text-[12px] text-gray-400 w-[25%] border-r justify-end px-4 h-full flex items-center gap-1'>
                                <RiSecurePaymentLine fontSize='20px' className='text-blue-600' />
                                Phương thức thanh toán
                            </h2>
                            <h2 className='text-[14px] text-text-primary text-end w-[20%]'>
                                {convertPaymentMethod(order?.payment_method)}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
