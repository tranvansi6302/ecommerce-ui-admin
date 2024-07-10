import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Product, ProductFilter } from '~/@types/product'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'

import productsApi from '~/apis/products.api'
import PATH from '~/constants/path'
import useQueryProducts from '~/hooks/useQueryProducts'
import { convertProductStatus } from '~/utils/format'

import { AxiosError } from 'axios'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { FaCheckDouble } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import { Variant } from '~/@types/variant'
import SetProductImage from '~/components/SetProductImage'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import { PRODUCT_STATUS } from '~/constants/status'
import useSetTitle from '~/hooks/useSetTitle'
import FilterProduct from './components/FilterProduct'
import { ProductStatus } from './components/FilterProduct/FilterProduct'
import RowVariant from './components/RowVariant'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

const selectedOptions = [
    { label: 'Chuyển đổi trạng thái kinh doanh', value: 'TOGGLE' },
    {
        label: 'Xóa vĩnh viễn',
        value: 'DELETE'
    }
]

export default function ProductList() {
    useSetTitle('Danh sách sản phẩm')
    const navigate = useNavigate()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [selectedProductStatus, setSelectedProductStatus] = useState<ProductStatus | null>(null)
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const queryConfig = useQueryProducts()
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: products, refetch } = useQuery({
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
    const skuBodyTemplate = useCallback((rowData: Product) => {
        return (
            <Link className='text-blue-600' to={`${PATH.PRODUCT_LIST}/${rowData.id}`}>
                {rowData.sku}
            </Link>
        )
    }, [])

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

    const productNameTemplate = useCallback((rowData: Product) => rowData.name, [])

    const categoryNameTemplate = useCallback((rowData: Product) => rowData?.category?.name, [])

    const brandNameTemplate = useCallback((rowData: Product) => rowData?.brand?.name, [])
    const productStatusTemplate = useCallback((rowData: Product) => {
        return (
            <MyButton text severity={rowData.status === PRODUCT_STATUS.ACTIVE ? 'success' : 'danger'}>
                <p className='text-[13.6px] font-medium'>{convertProductStatus(rowData.status).toUpperCase()}</p>
            </MyButton>
        )
    }, [])

    const header = useMemo(
        () => (
            <FilterProduct
                search={search}
                setSearch={setSearch}
                selectedBrand={selectedBrand as Brand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory as Category}
                setSelectedCategory={setSelectedCategory}
                selectedProductStatus={selectedProductStatus}
                setSelectedProductStatus={setSelectedProductStatus}
                brands={brands?.data.result as Brand}
                categories={categories?.data.result as Category}
            />
        ),
        [search, selectedBrand, selectedCategory, selectedProductStatus, brands?.data.result, categories?.data.result]
    )

    const deleteManyProductsMutation = useMutation({
        mutationFn: (data: { product_ids: number[] }) => productsApi.deleteManyProducts(data),
        onSuccess: (data) => {
            toast.success(`${data.data.message} ${selectedProducts.length} dòng dữ liệu`)
            refetch()
            setSelectedProducts([])
        },
        onError: () => {
            toast.error(MESSAGE.NOT_DELETE_CONSTRAINT)
        }
    })

    const updateManyStatusProductsMutation = useMutation({
        mutationFn: (data: { product_ids: number[] }) => productsApi.updateManyStatusProducts(data),
        onSuccess: (data) => {
            toast.success(`${data.data.message} ${selectedProducts.length} dòng dữ liệu`)
            refetch()
            setSelectedProducts([])
        },
        onError: (error) => {
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            toast.error(errorResponse?.message ?? '')
        }
    })

    const handleSelectedOptionChange = (e: DropdownChangeEvent) => {
        switch (e.value) {
            case 'TOGGLE': {
                const productIds = selectedProducts.map((product) => product.id)
                updateManyStatusProductsMutation.mutate({ product_ids: productIds })
                break
            }
            case 'DELETE': {
                const productIds = selectedProducts.map((product) => product.id)
                deleteManyProductsMutation.mutate({ product_ids: productIds })
                break
            }
            default:
                break
        }
    }
    const selectedHeader = useMemo(
        () => (
            <Fragment>
                <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                    <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                        <FaCheckDouble />
                        Đã chọn {selectedProducts.length} dòng trên trang này
                    </span>
                    <Dropdown
                        style={{ width: '300px' }}
                        className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                        options={selectedOptions}
                        onChange={handleSelectedOptionChange}
                        placeholder='Chọn thao tác'
                    />
                </div>
                <div className='text-[14px] font-normal'>
                    <ShowMessage
                        severity='warn'
                        detail='Lưu ý với trường hợp xóa vĩnh viễn chỉ xóa được sản phẩm nào không có bắt kì ràng buộc dữ liệu nào, sau khi xóa dữ liệu sẽ không được khôi phục'
                    />
                </div>
            </Fragment>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedProducts.length]
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
                <Column header='SKU' body={skuBodyTemplate} />
                <Column header='Ảnh' body={imageBodyTemplate} />
                <Column className='w-[35%]' field='name' header='Sản phẩm' body={productNameTemplate} />
                <Column field='category' header='Loại' body={categoryNameTemplate} />
                <Column field='brand' header='Thương hiệu' body={brandNameTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={productStatusTemplate} />
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
