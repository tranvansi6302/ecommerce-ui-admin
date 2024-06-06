import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'

interface FilterProductProps {
    selectedBrand: any
    setSelectedBrand: (value: any) => void
    selectedCategory: any
    setSelectedCategory: (value: any) => void
    brands: any
    categories: any
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
    brands,
    categories
}: FilterProductProps) {
    useEffect(() => {
        console.log(selectedBrand)
    }, [selectedBrand])

    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(search)
    }

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Tất cả sản phẩm
            </p>
            <div className='flex justify-content-between gap-2'>
                <form className='w-2/5' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo tên sản phẩm, tên sản phẩm'
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
                            options={brands?.data.result}
                            optionLabel='name'
                            placeholder='Chọn thương hiệu'
                            name='brand'
                        />
                    </div>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedCategory}
                            onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)}
                            options={categories?.data.result}
                            optionLabel='name'
                            placeholder='Chọn loại sản phẩm'
                            name='category'
                        />
                    </div>

                    <MyButton
                        severity='secondary'
                        icon='pi pi-filter-slash'
                        text
                        className='px-4 py-3 rounded-none text-gray-900 font-semibold'
                    >
                        <p className='ml-1 text-[14px]'>Xóa bộ lọc</p>
                    </MyButton>
                </div>
            </div>
        </div>
    )
}
