import { DropdownChangeEvent } from 'primereact/dropdown'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { SupplierStatus } from '~/@types/supplier'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import { SUPPLIER_STATUS } from '~/constants/status'
import useQueryPurchaseOrders from '~/hooks/useQueryPurchaseOrders'

const supplierStatus: SupplierStatus[] = [
    { id: SUPPLIER_STATUS.ACTIVE, status: 'Đang giao dịch' },
    { id: SUPPLIER_STATUS.INACTIVE, status: 'Ngừng giao dịch' }
]

interface FilterSupplierProps {
    search: string
    setSearch: (value: string) => void
    selectedSupplierStatus: SupplierStatus | null
    setSelectedSupplierStatus: (value: SupplierStatus | null) => void
}

export default function FilterSupplier({
    search,
    setSearch,
    selectedSupplierStatus,
    setSelectedSupplierStatus
}: FilterSupplierProps) {
    const navigate = useNavigate()
    const queryConfig = useQueryPurchaseOrders()
    const { register } = useForm()

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
        console.log('Clean...')
    }

    console.log('filter...')

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách nhà cung cấp
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
                            value={selectedSupplierStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedSupplierStatus(e.value)}
                            options={supplierStatus}
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
