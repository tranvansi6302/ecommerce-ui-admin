import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { PurchaseOrderStatus } from '~/@types/purchase'
import { Supplier } from '~/@types/supplier'
import suppliersApi from '~/apis/supplier.api'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import { PURCHASE_ORDER_STATUS } from '~/constants/status'
import useQueryPurchaseOrders from '~/hooks/useQueryPurchaseOrders'

const purchaseOrderStatus: PurchaseOrderStatus[] = [
    {
        id: PURCHASE_ORDER_STATUS.PENDING,
        status: 'Chờ xác nhận'
    },
    {
        id: PURCHASE_ORDER_STATUS.COMPLETED,
        status: 'Đã hoàn thành'
    },
    {
        id: PURCHASE_ORDER_STATUS.CANCELLED,
        status: 'Đã hủy'
    }
]

interface FilterPurchaseOrderProps {
    search: string
    setSearch: (value: string) => void
    selectedSupplier: Supplier | null
    setSelectedSupplier: (value: Supplier | null) => void
    selectedPurchaseOrderStatus: PurchaseOrderStatus | null
    setSelectedPurchaseOrderStatus: (value: PurchaseOrderStatus | null) => void
}

export default function FilterPurchaseOrder({
    search,
    setSearch,
    selectedSupplier,
    selectedPurchaseOrderStatus,
    setSelectedSupplier,
    setSelectedPurchaseOrderStatus
}: FilterPurchaseOrderProps) {
    const navigate = useNavigate()
    const queryConfig = useQueryPurchaseOrders()

    const { register } = useForm()

    const { data: suppliers } = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => suppliersApi.getAllSuppliers(),
        placeholderData: keepPreviousData
    })

    // Active filter
    useEffect(() => {
        if (queryConfig.status) {
            const active = purchaseOrderStatus.find((status) => status.id === queryConfig.status)
            setSelectedPurchaseOrderStatus(active || null)
        }
        if (queryConfig.supplier && suppliers) {
            setSelectedSupplier(
                suppliers.data.result.find((supplier: { id: number }) => supplier.id === parseInt(queryConfig.supplier || '0'))
            )
        }
        if (queryConfig.search) {
            setSearch(queryConfig.search)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suppliers])

    useEffect(() => {
        if (selectedPurchaseOrderStatus) {
            navigate({
                pathname: PATH.PURCHASE_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    status: selectedPurchaseOrderStatus.id
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPurchaseOrderStatus, setSelectedPurchaseOrderStatus])

    useEffect(() => {
        if (selectedSupplier) {
            navigate({
                pathname: PATH.PURCHASE_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    supplier: selectedSupplier.id.toString()
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSupplier, setSelectedSupplier])

    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate({
            pathname: PATH.PURCHASE_LIST,
            search: createSearchParams({
                ...queryConfig,
                search
            }).toString()
        })
    }

    const handleClean = () => {
        setSearch('')
        setSelectedSupplier(null)
        setSelectedPurchaseOrderStatus(null)
        navigate({
            pathname: PATH.PURCHASE_LIST,
            search: createSearchParams(omit(queryConfig, ['search', 'status', 'supplier', 'page', 'limit'])).toString()
        })
    }

    console.log('filter...')

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách đơn nhập hàng
            </p>
            <div className='flex justify-content-between gap-2'>
                <form className='w-2/5' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            register={register}
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo mã đơn hàng'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className='flex items-baseline gap-2'>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedPurchaseOrderStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedPurchaseOrderStatus(e.value)}
                            options={purchaseOrderStatus}
                            optionLabel='status'
                            placeholder='Trạng thái'
                            name='status'
                        />
                    </div>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedSupplier}
                            onChange={(e: DropdownChangeEvent) => setSelectedSupplier(e.value)}
                            options={suppliers?.data.result}
                            optionLabel='name'
                            placeholder='Nhà cung cấp'
                            name='supplier_id'
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
