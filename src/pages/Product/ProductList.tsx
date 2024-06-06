import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MyButton from '~/components/MyButton'

import { useQuery } from '@tanstack/react-query'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Product } from '~/@types/product'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'

import productsApi from '~/apis/products.api'
import DefaultProductImage from '~/components/DefaultProductImage'
import PATH from '~/constants/path'
import FilterProduct from './components/FilterProduct'
import RowVariant from './components/RowVariant'

export default function ProductList() {
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => productsApi.getAllProducts()
    })

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands()
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories()
    })

    const variantNameTemplate = useCallback((rowData: Variant) => rowData.variant_name, [])

    const warehouseTemplate = useCallback((rowData: Variant) => rowData?.warehouse?.available_quantity ?? 0, [])

    const purchasePriceTemplate = useCallback((rowData: Variant) => rowData?.warehouse?.purchase_price ?? 0, [])

    const salePriceTemplate = useCallback((rowData: Variant) => rowData?.current_price_plan?.sale_price ?? 0, [])

    // Xử lý hình ảnh
    const imageBodyTemplate = useCallback(() => <DefaultProductImage />, [])

    const allowExpansion = useCallback((rowData: Product) => rowData.variants!.length > 0, [])

    const rowVariantTemplate = useCallback(
        (data: Product) => {
            return (
                <RowVariant
                    data={data}
                    variantNameTemplate={variantNameTemplate}
                    warehouseTemplate={warehouseTemplate}
                    purchasePriceTemplate={purchasePriceTemplate}
                    salePriceTemplate={salePriceTemplate}
                />
            )
        },
        [variantNameTemplate, warehouseTemplate, purchasePriceTemplate, salePriceTemplate]
    )

    const productNameTemplate = useCallback((rowData: Product) => {
        return (
            <Link className='text-blue-600' to={`/products/${rowData.id}`}>
                {rowData.name}
            </Link>
        )
    }, [])

    const categoryNameTemplate = useCallback((rowData: Product) => rowData.category.name, [])

    const brandNameTemplate = useCallback((rowData: Product) => rowData.brand.name, [])

    const header = useMemo(
        () => (
            <FilterProduct
                search={search}
                setSearch={setSearch}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                brands={brands}
                categories={categories}
            />
        ),
        [search, setSearch, selectedBrand, selectedCategory, brands, categories]
    )

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-2'>
                <span>Đã chọn {selectedProducts.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedProducts]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedProducts(e.value as Product[])
    }, [])

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
                value={(products?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowVariantTemplate}
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
                <Column className='w-1/3' field='name' header='Sản phẩm' body={productNameTemplate} />
                <Column field='category' header='Loại' body={categoryNameTemplate} />
                <Column field='brand' header='Thương hiệu' body={brandNameTemplate} />
                <Column field='createdDate' header='Ngày khởi tạo' sortable />
            </DataTable>
        </div>
    )
}
