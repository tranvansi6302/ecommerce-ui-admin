import { Column } from 'primereact/column'
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MyButton from '~/components/MyButton'

import { useForm } from 'react-hook-form'
import MyInputSearch from '~/components/MyInputSearch'
import { ProductService } from './ProductService'
import PATH from '~/constants/path'
import MyDropdown from '~/components/MyDrowdown'

interface Variant {
    id: string
    name: string
    stock: number
    costPrice: number
    salePrice: number
}

interface Product {
    id: string
    code: string
    name: string
    description: string
    image: string
    price: number
    category: string
    brand: string
    createdDate: string
    inventoryStatus: string
    rating: number
    variants?: Variant[]
}

interface Brand {
    name: string
    code: string
}

interface Category {
    name: string
    code: string
}

const brands: Brand[] = [
    { name: 'Nike', code: 'NI' },
    { name: 'Adidas', code: 'AD' },
    { name: 'Pumma', code: 'PU' }
]

const categories: Brand[] = [
    { name: 'Áo thun', code: 'AT' },
    { name: 'Giày thể thao', code: 'GTT' },
    { name: 'Quần jogger ', code: 'QJ' }
]

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [globalFilter] = useState<string>('')

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    useEffect(() => {
        ProductService.getProductsWithVariantsSmall().then((data) => setProducts(data))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }

    const costPriceBodyTemplate = (rowData: Variant) => {
        return formatCurrency(rowData.costPrice)
    }

    const salePriceBodyTemplate = (rowData: Variant) => {
        return formatCurrency(rowData.salePrice)
    }

    // Xử lý hình ảnh
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const imageBodyTemplate = (rowData: Product) => {
        return (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                height='35px'
                className='jss13133'
                style={{ color: 'rgb(232, 234, 235)', height: 35 }}
            >
                <path
                    d='M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2ZM5 19V5h14l.002 14H5Z'
                    fill='currentColor'
                />
                <path d='m10 14-1-1-3 4h12l-5-7-3 4ZM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' fill='currentColor' />
            </svg>
        )
    }

    const allowExpansion = (rowData: Product) => {
        return rowData.variants!.length > 0
    }

    const rowExpansionTemplate = (data: Product) => {
        return (
            <div className='px-3'>
                <DataTable value={data.variants} tableStyle={{ fontSize: '14px' }}>
                    <Column field='name' header='Phiên bản'></Column>
                    <Column field='stock' header='Tồn kho'></Column>
                    <Column field='costPrice' header='Giá nhập' body={costPriceBodyTemplate} sortable></Column>
                    <Column field='salePrice' header='Giá bán' body={salePriceBodyTemplate} sortable></Column>
                </DataTable>
            </div>
        )
    }

    const nameBodyTemplate = (rowData: Product) => {
        return (
            <Link className='text-blue-600' to={`/products/${rowData.id}`}>
                {rowData.name}
            </Link>
        )
    }

    const { register, handleSubmit } = useForm()

    const onsubmit = handleSubmit((data) => {
        console.log(data)
    })

    const header = (
        <div className=''>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Tất cả sản phẩm
            </p>
            <form onSubmit={onsubmit} className='flex  justify-content-between gap-2'>
                <div className='w-2/5'>
                    <MyInputSearch
                        className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                        style={{ borderRadius: '2px', fontSize: '13.6px' }}
                        name='search'
                        placeholder='Tìm kiếm theo tên sản phẩm, tên sản phẩm'
                        register={register}
                    />
                </div>
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

                    <MyButton
                        severity='secondary'
                        icon='pi pi-filter-slash'
                        text
                        className='px-4 py-3 rounded-none text-gray-900 font-semibold'
                    >
                        <p className='ml-1 text-[14px]'>Xóa bộ lọc</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )

    const selectedHeader = (
        <div className='flex flex-wrap justify-content-between gap-2'>
            <span>Đã chọn {selectedProducts.length} sản phẩm trên trang này</span>
            <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
        </div>
    )

    const onSelectionChange = (e: { value: Product[] }) => {
        setSelectedProducts(e.value)
    }

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                    <MyButton icon='pi pi-download' text className='px-4 py-3 rounded-none text-gray-900 font-semibold'>
                        <p className='ml-1 text-[14px]'>Xuất file</p>
                    </MyButton>
                    <MyButton icon='pi pi-upload' text className='px-4 py-3 rounded-none text-gray-900 font-semibold'>
                        <p className='ml-1 text-[14px] '>Nhập file</p>
                    </MyButton>
                </div>
                <Link to={PATH.PRODUCT_CREATE}>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Thêm sản phẩm</p>
                    </MyButton>
                </Link>
            </div>
            <DataTable
                value={products}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey='id'
                header={selectedProducts.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedProducts}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column className='pr-0 w-[35px]' expander={allowExpansion} />
                <Column selectionMode='multiple' className='w-[40px]' />
                <Column header='Ảnh' body={imageBodyTemplate} />
                <Column className='w-1/3' field='name' header='Sản phẩm' body={nameBodyTemplate} />
                <Column field='category' header='Loại' />
                <Column field='brand' header='Thương hiệu' />
                <Column field='createdDate' header='Ngày khởi tạo' sortable />
            </DataTable>
        </div>
    )
}
