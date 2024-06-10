import { omit } from 'lodash'
import { useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import useQueryConfig from '~/hooks/useQueryConfig'

interface FilterBrandProps {
    search: string
    setSearch: (value: string) => void
}
export default function FilterBrand({ search, setSearch }: FilterBrandProps) {
    const queryConfig = useQueryConfig()
    const navigate = useNavigate()

    // Active filter
    useEffect(() => {
        if (queryConfig.name) {
            setSearch(queryConfig.name)
        }
    }, [queryConfig, setSearch])

    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate({
            pathname: PATH.PRODUCT_LIST,
            search: createSearchParams({
                ...queryConfig,
                name: search
            }).toString()
        })
    }

    const handleClean = () => {
        setSearch('')
        navigate({
            pathname: PATH.PRODUCT_LIST,
            search: createSearchParams(omit(queryConfig, ['category', 'brand', 'name'])).toString()
        })
    }

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Tất cả danh mục sản phẩm
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
