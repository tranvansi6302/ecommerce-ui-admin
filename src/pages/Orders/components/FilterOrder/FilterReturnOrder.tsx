import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import { RETURN_ORDER_STATUS } from '~/constants/status'
import useQueryOrders from '~/hooks/useQueryOrders'

export type ReturnOrderStatusType = {
    id: string
    status: string
}

const returnOrderStatus: ReturnOrderStatusType[] = [
    { id: RETURN_ORDER_STATUS.REQUESTED, status: 'Chờ xác nhận' },
    { id: RETURN_ORDER_STATUS.ACCEPTED, status: 'Đã xác nhận' },
    { id: RETURN_ORDER_STATUS.REJECTED, status: 'Đã từ chối' }
]

interface FilterReturnOrderProps {
    selectedOrderStatus: ReturnOrderStatusType | null
    setSelectedOrderStatus: (value: ReturnOrderStatusType | null) => void
    search: string
    setSearch: (value: string) => void
}
export default function FilterReturnOrder({
    search,
    setSearch,
    selectedOrderStatus,
    setSelectedOrderStatus
}: FilterReturnOrderProps) {
    const queryConfig = useQueryOrders()
    const navigate = useNavigate()
    // Active filter
    useEffect(() => {
        if (queryConfig.status) {
            const active = returnOrderStatus.find((status) => status.id.toString() === queryConfig.status)
            setSelectedOrderStatus(active || null)
        }

        if (queryConfig.search) {
            setSearch(queryConfig.search)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (selectedOrderStatus) {
            navigate({
                pathname: PATH.RETURN_ORDERS,
                search: createSearchParams({
                    ...queryConfig,
                    status: selectedOrderStatus.id.toString()
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOrderStatus, setSelectedOrderStatus])

    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate({
            pathname: PATH.RETURN_ORDERS,
            search: createSearchParams({
                ...queryConfig,
                search
            }).toString()
        })
    }

    const handleClean = () => {
        setSearch('')
        setSelectedOrderStatus(null)
        navigate({
            pathname: PATH.RETURN_ORDERS,
            search: createSearchParams(omit(queryConfig, ['search', 'page', 'limit', 'status'])).toString()
        })
    }

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách đơn hàng
            </p>

            <div className='flex justify-content-between gap-2'>
                <form className='w-1/2' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo mã đơn hàng, tên sản phẩm'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className='flex gap-2'>
                    <div className='w-[300px]'>
                        <MyDropdown
                            value={selectedOrderStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedOrderStatus(e.value)}
                            options={returnOrderStatus}
                            optionLabel='status'
                            placeholder='Trạng thái'
                            name='status'
                        />
                    </div>

                    <MyButton
                        severity='secondary'
                        icon='pi pi-filter-slash'
                        text
                        className='px-4 py-3 rounded-none text-gray-900 font-semibold'
                        onClick={handleClean}
                    >
                        <p className='ml-1 text-[14px]'>Xóa bộ lọc</p>
                    </MyButton>
                </div>
            </div>
        </div>
    )
}
