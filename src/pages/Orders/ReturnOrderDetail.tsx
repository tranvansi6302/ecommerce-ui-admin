import { useQuery } from '@tanstack/react-query'
import { IoChevronBack } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { returnOrderApi } from '~/apis/returnOrder.api'
import { ReturnOrderStatus } from '~/constants/status'
import { convertReturnOrderStatus, formatCurrencyVND, formatDateFull } from '~/utils/format'

export default function ReturnOrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data } = useQuery({
        queryKey: ['return-order-detail', id],
        queryFn: () => returnOrderApi.getDetail(Number(id)),
        enabled: !!id
    })

    const returnOrder = data?.data?.result

    const handleBack = () => {
        navigate(-1)
    }

    console.log('returnOrder', returnOrder)
    return (
        <Fragment>
            <div className='rounded-sm  pb-10  min-h-[100vh] md:pb-20'>
                <div className='border-b border-b-gray-200 py-6 flex items-center justify-between px-2 md:px-7 bg-white'>
                    <button onClick={handleBack} className='flex items-center gap-1 uppercase text-gray-500'>
                        <IoChevronBack />
                        Trở lại
                    </button>
                    <div className='flex items-center text-[14px]'>
                        <div className='uppercase text-blue-600'>
                            Đơn hàng {convertReturnOrderStatus(returnOrder?.return_status as ReturnOrderStatus)}
                        </div>
                    </div>
                </div>

                <div className='line-order'></div>
                {/* Info order */}
                <div className='px-7 pt-12 flex gap-14  bg-white py-6'>
                    <div className='px-5'>
                        <h2 className='capitalize text-lg'>Thông tin đơn hàng</h2>
                        <div className='mt-4'>
                            <h5 className='text-gray-500'>
                                Ngày yêu cầu đổi trả: {formatDateFull(returnOrder?.date_requested || '')}
                            </h5>
                            {returnOrder?.return_status === ReturnOrderStatus.ACCEPTED && (
                                <h5 className='text-blue-600 mt-3'>
                                    Ngày xác nhận: {formatDateFull(returnOrder?.date_accepted)}
                                </h5>
                            )}
                            <p className='mt-3 text-[12px] leading-5'>Ghi chú: {returnOrder?.return_reason || 'Không có'}</p>

                            {returnOrder?.return_status === ReturnOrderStatus.REJECTED && (
                                <Fragment>
                                    <h5 className='text-blue-600 mt-3'>
                                        Từ chối đổi trả vào lúc: {formatDateFull(returnOrder?.date_rejected)}
                                    </h5>
                                    <p className='mt-3 text-[12px] leading-5'>
                                        Lý do: {returnOrder?.rejected_reason || 'Không có'}
                                    </p>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Detail Product */}
                <div className='p-7 bg-white mt-4'>
                    <div className=''>
                        <div className='my-6 flex justify-between border border-dashed border-gray-300 p-4 rounded-lg'>
                            <div className='w-[65%] flex items-center gap-1'>
                                <div className='w-20 h-20 flex-shrink-0'>
                                    <img
                                        className='w-full h-full object-cover border border-gray-300 rounded-lg'
                                        src={returnOrder?.product_image}
                                        alt='product'
                                    />
                                </div>
                                <div className='flex-grow px-2 pt-1 pb-2 text-left text-[14px] flex flex-col gap-1'>
                                    <Link to={`123`} className='text-left line-clamp-1'>
                                        {returnOrder?.product_name}
                                    </Link>
                                    <p className='text-[14px] text-gray-500'>
                                        Phân loại: {returnOrder?.variant?.color} - {returnOrder?.variant?.size}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2  border-t-gray-100 pt-4 border border-dashed border-gray-300 rounded-lg p-4'>
                            <h2 className='text-black text-[14px] pb-2'>Thông tin đổi trả</h2>
                            {/* Line */}
                            <div className='border-t border-dashed border-t-gray-100 my-3'></div>
                            <p className='text-gray-600 text-[13px]'>Màu cũ: {returnOrder?.old_variant?.color}</p>
                            <p className='text-gray-600 text-[13px] mt-2'>Màu mới: {returnOrder?.variant?.color}</p>
                            {/* Line */}
                            <div className='border-t border-dashed border-t-gray-100 my-3'></div>
                            <p className='text-gray-600 text-[13px]'>Kích cỡ cũ: {returnOrder?.old_variant?.size}</p>
                            <p className='text-gray-600 text-[13px] mt-2'>Kích cỡ mới: {returnOrder?.variant?.size}</p>

                            {/* Line */}
                            <div className='border-t border-dashed border-t-gray-100 my-3'></div>

                            <p className='text-gray-600 text-[13px]'>
                                Giá cũ: {formatCurrencyVND(returnOrder?.old_price as number)}
                            </p>
                            <p className='text-gray-600 text-[13px] mt-2'>
                                Giá mới: {formatCurrencyVND(returnOrder?.price as number)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
