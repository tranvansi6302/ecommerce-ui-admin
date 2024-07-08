import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Product, ProductFilter } from '~/@types/product'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'

import productsApi from '~/apis/products.api'
import PATH from '~/constants/path'
import useQueryProducts from '~/hooks/useQueryProducts'
import { formatDate } from '~/utils/format'

import { Variant } from '~/@types/variant'
import SetProductImage from '~/components/SetProductImage'
import useSetTitle from '~/hooks/useSetTitle'
import FilterProduct from './components/FilterProduct'
import RowVariant from './components/RowVariant'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function ProductList() {
    useSetTitle('Danh sách sản phẩm')
    const navigate = useNavigate()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const queryConfig = useQueryProducts()
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: products } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => productsApi.getAllProducts(queryConfig as ProductFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands({ status: 'ACTIVE' }),
        placeholderData: keepPreviousData
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories({ status: 'ACTIVE' }),
        placeholderData: keepPreviousData
    })

    const variantNameTemplate = useCallback((rowData: Variant) => rowData.variant_name, [])

    const warehouseTemplate = useCallback((rowData: Variant) => rowData?.warehouse?.available_quantity ?? 0, [])

    const purchasePriceTemplate = useCallback((rowData: Variant) => rowData?.warehouse?.purchase_price ?? 0, [])

    const salePriceTemplate = useCallback((rowData: Variant) => rowData?.current_price_plan?.sale_price ?? 0, [])

    // handle image (default)
    const imageBodyTemplate = useCallback((rowData: Product) => <SetProductImage productImages={rowData.product_images} />, [])

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

    const productCreatedAtTemplate = useCallback((rowData: Product) => formatDate(rowData.created_at), [])
    const categoryNameTemplate = useCallback((rowData: Product) => rowData?.category?.name, [])

    const brandNameTemplate = useCallback((rowData: Product) => rowData?.brand?.name, [])

    const header = useMemo(
        () => (
            <FilterProduct
                search={search}
                setSearch={setSearch}
                selectedBrand={selectedBrand as Brand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory as Category}
                setSelectedCategory={setSelectedCategory}
                brands={brands?.data.result as Brand}
                categories={categories?.data.result as Category}
            />
        ),
        [search, selectedBrand, selectedCategory, brands?.data.result, categories?.data.result]
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

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.PRODUCT_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (products?.data?.pagination?.limit as number) * (products?.data?.pagination?.total_page as number)
    }, [products?.data?.pagination?.limit, products?.data?.pagination?.total_page])

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
                <Column field='createdDate' header='Ngày khởi tạo' body={productCreatedAtTemplate} sortable />
            </DataTable>
            <div className='flex justify-end mt-3'>
                <Paginator
                    style={{ backgroundColor: 'transparent', textAlign: 'right' }}
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 15]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}
