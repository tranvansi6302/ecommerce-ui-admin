import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import useQueryBrands from '~/hooks/useQueryBrands'

interface FilterBrandProps {
    search: string
    setSearch: (value: string) => void
    selectedBrandStatus: BrandStatus | null
    setSelectedBrandStatus: (value: BrandStatus | null) => void
}

export interface BrandStatus {
    id: string
    status: string
}
const brandStatus: BrandStatus[] = [
    { id: 'ACTIVE', status: 'Đang kinh doanh' },
    { id: 'INACTIVE', status: 'Ngừng kinh doanh' }
]
export default function FilterBrand({ search, setSearch, selectedBrandStatus, setSelectedBrandStatus }: FilterBrandProps) {
    const navigate = useNavigate()
    const queryConfig = useQueryBrands()
    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate({
            pathname: PATH.BRAND_LIST,
            search: createSearchParams({
                ...queryConfig,
                search
            }).toString()
        })
    }

    useEffect(() => {
        if (selectedBrandStatus) {
            navigate({
                pathname: PATH.BRAND_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    status: selectedBrandStatus.id.toString()
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrandStatus, setSelectedBrandStatus])
    const handleClean = () => {
        setSearch('')
        setSelectedBrandStatus(null)

        navigate({
            pathname: PATH.BRAND_LIST,
            search: createSearchParams(omit(queryConfig, ['search', 'status', 'page', 'limit'])).toString()
        })
    }
    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách thương hiệu sản phẩm
            </p>
            <div className='flex justify-content-between gap-2'>
                <form className='w-2/5' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo tên thương hiệu'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className='flex gap-2'>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedBrandStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedBrandStatus(e.value)}
                            options={brandStatus}
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
