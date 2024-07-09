import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown'
import MyInputSearch from '~/components/MyInputSearch'
import PATH from '~/constants/path'
import { PRODUCT_STATUS } from '~/constants/status'
import useQueryProducts from '~/hooks/useQueryProducts'

type ProductStatusId = keyof typeof PRODUCT_STATUS

export interface ProductStatus {
    id: (typeof PRODUCT_STATUS)[ProductStatusId]
    status: string
}

const productStatus: ProductStatus[] = [
    { id: PRODUCT_STATUS.ACTIVE, status: 'Đang kinh doanh' },
    { id: PRODUCT_STATUS.INACTIVE, status: 'Ngừng kinh doanh' },
    { id: PRODUCT_STATUS.INSTOCK, status: 'Đã nhập kho' },
    { id: PRODUCT_STATUS.OUTOFSTOCK, status: 'Chưa nhập kho' }
]

interface FilterProductProps {
    selectedBrand: Brand | null
    setSelectedBrand: (value: Brand | null) => void
    selectedCategory: Category | null
    setSelectedCategory: (value: Category | null) => void
    selectedProductStatus: ProductStatus | null
    setSelectedProductStatus: (value: ProductStatus | null) => void
    brands: Brand
    categories: Category
    search: string
    setSearch: (value: string) => void
}
export default function FilterProduct({
    search,
    setSearch,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    selectedProductStatus,
    setSelectedProductStatus,
    brands,
    categories
}: FilterProductProps) {
    const queryConfig = useQueryProducts()
    const navigate = useNavigate()

    // Active filter
    useEffect(() => {
        if (queryConfig.brand && brands) {
            setSelectedBrand(brands.find((b) => b.slug === queryConfig.brand))
        }
        if (queryConfig.category && categories) {
            setSelectedCategory(categories.find((c) => c.slug === queryConfig.category))
        }
        if (queryConfig.name) {
            setSearch(queryConfig.name)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brands, categories])

    useEffect(() => {
        if (selectedBrand) {
            navigate({
                pathname: PATH.PRODUCT_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    brand: selectedBrand?.slug
                }).toString()
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, setSelectedBrand])

    useEffect(() => {
        if (selectedCategory) {
            navigate({
                pathname: PATH.PRODUCT_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    category: selectedCategory?.slug
                }).toString()
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, setSelectedCategory])

    useEffect(() => {
        if (selectedProductStatus) {
            navigate({
                pathname: PATH.PRODUCT_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    status: selectedProductStatus.id.toString()
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductStatus, setSelectedProductStatus])

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
        setSelectedBrand(null)
        setSelectedCategory(null)
        setSearch('')
        navigate({
            pathname: PATH.PRODUCT_LIST,
            search: createSearchParams(omit(queryConfig, ['category', 'brand', 'name', 'page', 'limit', 'status'])).toString()
        })
    }

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách sản phẩm
            </p>
            <div className='flex justify-content-between gap-2'>
                <form className='w-[35%]' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo tên sản phẩm, mã sản phẩm'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className='flex gap-2'>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedBrand}
                            onChange={(e: DropdownChangeEvent) => setSelectedBrand(e.value)}
                            options={brands}
                            optionLabel='name'
                            placeholder='Chọn thương hiệu'
                            name='brand'
                        />
                    </div>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedCategory}
                            onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)}
                            options={categories}
                            optionLabel='name'
                            placeholder='Chọn loại sản phẩm'
                            name='category'
                        />
                    </div>

                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedProductStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedProductStatus(e.value)}
                            options={productStatus}
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
