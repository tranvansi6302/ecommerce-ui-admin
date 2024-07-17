import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dialog } from 'primereact/dialog'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ConfirmOrderRequest, ItemType } from '~/@types/ghn'
import { Order } from '~/@types/order'
import { MessageResponse } from '~/@types/util'
import ghnApi from '~/apis/ghn.api'
import ordersApi from '~/apis/orders.api'
import MyButton from '~/components/MyButton'
import MyTextarea from '~/components/MyTextarea'
import GHN_CONFIG from '~/constants/ghn'
import MESSAGE from '~/constants/message'
import { ORDER_STATUS, PAYMENT_METHOD } from '~/constants/status'
import { queryClient } from '~/main'

type ConfirmOrderProps = {
    openConfirmOrder: boolean
    setOpenConfirmOrder: (value: boolean) => void
    orderPayload: Order
    setMessage: (value: string) => void
    setMessageConfirmOrder: (value: string) => void
}

export default function ConfirmOrder({
    openConfirmOrder,
    setOpenConfirmOrder,
    orderPayload,
    setMessage,
    setMessageConfirmOrder
}: ConfirmOrderProps) {
    const { register, handleSubmit, reset } = useForm<{ note: string }>()
    const refMessage = useRef<string>('')

    const totalProduct = useMemo(() => {
        return orderPayload?.order_details.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
    }, [orderPayload?.order_details])

    const totalCheckout = useMemo(() => {
        return totalProduct + orderPayload?.shipping_fee - orderPayload?.discount_order - orderPayload?.discount_shipping
    }, [orderPayload?.discount_order, orderPayload?.discount_shipping, orderPayload?.shipping_fee, totalProduct])

    const createOrderGHNMutation = useMutation({
        mutationFn: (data: ConfirmOrderRequest) => ghnApi.createOrder(data),
        onSuccess: (data) => {
            const orderCode = data?.data?.data?.order_code as string

            refMessage.current = `Đơn hàng đã tạo thành công với mã vận đơn ${orderCode}`
        }
    })

    const updateStatusOrderMutation = useMutation({
        mutationFn: (body: { id: number; status: string; canceled_reason?: string; tracking_code: string }) =>
            ordersApi.updateStatusOrder(body.id, body),
        onSuccess: (data) => {
            toast.success(data?.data?.message)
            queryClient.invalidateQueries({
                queryKey: ['orders']
            })
            setMessageConfirmOrder(refMessage.current)
            reset()
        },
        onError: (error) => {
            console.log(error)
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            setMessage(errorResponse?.message ?? '')
            toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        const addresses = orderPayload?.address.split(',')
        console.log(addresses)
        const province = addresses[3]?.trim()
        const district = addresses[2]?.trim()
        const ward = addresses[1]?.trim()

        const items = orderPayload?.order_details.map((item) => {
            return {
                name: item?.variant?.variant_name,
                quantity: item?.quantity,
                weight: GHN_CONFIG.WEIGHT,
                length: GHN_CONFIG.LENGTH,
                width: GHN_CONFIG.WIDTH,
                height: GHN_CONFIG.HEIGHT,
                price: Math.floor(item?.price / 1000) * 1000
            }
        })
        const finalData = {
            ...data,
            payment_type_id: GHN_CONFIG.PAYMENT_TYPE_ID,
            required_note: GHN_CONFIG.REQUIRED_NOTE,
            to_name: orderPayload?.user?.full_name,
            to_phone: orderPayload?.phone_number,
            to_address: orderPayload?.address,
            to_ward_name: ward,
            to_district_name: district,
            to_province_name: province,
            cod_amount: orderPayload?.payment_method === PAYMENT_METHOD.CASH_ON_DELIVERY ? totalCheckout : 0,
            weight: GHN_CONFIG.WEIGHT,
            length: GHN_CONFIG.LENGTH,
            width: GHN_CONFIG.WIDTH,
            height: GHN_CONFIG.HEIGHT,
            content: '',
            insurance_value: orderPayload?.shipping_fee,
            service_type_id: GHN_CONFIG.SERVICE_TYPE_ID,
            items: items as ItemType[]
        }
        const resOrder = await createOrderGHNMutation.mutateAsync(finalData)
        await updateStatusOrderMutation.mutateAsync({
            id: orderPayload?.id,
            status: ORDER_STATUS.CONFIRMED,
            tracking_code: resOrder?.data?.data?.order_code
        })
    })

    return (
        <Dialog
            header={<p className='font-medium text-gray-900 capitalize'>Ghi chú đơn hàng nếu có</p>}
            visible={openConfirmOrder}
            style={{ width: '50vw' }}
            onHide={() => {
                if (!openConfirmOrder) return
                setOpenConfirmOrder(false)
                reset()
            }}
        >
            <div className='m-0'>
                <form onSubmit={onSubmit}>
                    <MyTextarea
                        register={register}
                        placeholder='Nhập ghi chú'
                        className='w-full py-0 pt-2 font-normal flex items-center'
                        classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                        name='note'
                    />
                    <div className='flex justify-end gap-4  pt-6'>
                        <MyButton
                            type='button'
                            onClick={() => {
                                setOpenConfirmOrder(false)
                                reset()
                            }}
                            className='rounded-[3px] h-9'
                            outlined
                        >
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                        <MyButton
                            loading={createOrderGHNMutation.isPending}
                            type='submit'
                            onClick={() => {
                                setOpenConfirmOrder(false)
                            }}
                            className='rounded-[3px] h-9 w-36'
                        >
                            <p className='font-semibold text-[14px]'>Xác nhận</p>
                        </MyButton>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}
