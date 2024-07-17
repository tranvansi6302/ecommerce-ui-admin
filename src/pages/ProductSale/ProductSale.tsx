import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Column } from 'primereact/column'
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { useCallback, useMemo, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { ProductFilter, ProductImage, ProductSaleFilters, ProductSaleType } from '~/@types/product'
import { Variant } from '~/@types/variant'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import productsApi from '~/apis/products.api'
import SetProductImage from '~/components/SetProductImage'
import PATH from '~/constants/path'
import useQueryProductsSales from '~/hooks/useQueryProductsSales'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrencyVND, formatDate } from '~/utils/format'
import FilterProductSale from './components/FilterProductSale'
import RowVariant from './components/RowVariant'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function ProductSale() {
    useSetTitle('Danh sách sản phẩm đang được bán')
    const navigate = useNavigate()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [search, setSearch] = useState<string>('')
    const [globalFilter] = useState<string>('')
    const queryConfig = useQueryProductsSales()
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: productsSales } = useQuery({
        queryKey: ['productsSales', queryConfig],
        queryFn: () => productsApi.getAllProductSale(queryConfig as ProductSaleFilters),
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

    const currentPriceTemplate = useCallback((rowData: Variant) => {
        return rowData?.current_price_plan?.promotion_price
            ? formatCurrencyVND(rowData?.current_price_plan?.promotion_price)
            : formatCurrencyVND(rowData?.current_price_plan?.sale_price)
    }, [])
    const applyDateTemplate = useCallback((rowData: Variant) => {
        if (rowData.current_price_plan.start_date && rowData.current_price_plan.end_date) {
            return `${formatDate(rowData.current_price_plan.start_date)} - ${formatDate(rowData.current_price_plan.end_date)}`
        }
        return `${formatDate(rowData.current_price_plan.start_date)} - Không có`
    }, [])

    const imageBodyTemplate = useCallback(
        (rowData: ProductSaleType) => <SetProductImage productImages={rowData?.images as ProductImage[]} />,
        []
    )

    const skuBodyTemplate = useCallback((rowData: ProductSaleType) => {
        return (
            <Link className='text-blue-600' to={`${PATH.PRODUCT_LIST}/${rowData.product_id}`}>
                {rowData.sku}
            </Link>
        )
    }, [])

    const allowExpansion = useCallback((rowData: ProductSaleType) => rowData.variants!.length > 0, [])

    const rowVariantTemplate = useCallback(
        (data: ProductSaleType) => {
            return (
                <RowVariant
                    data={data}
                    variantNameTemplate={variantNameTemplate}
                    warehouseTemplate={warehouseTemplate}
                    currentPriceTemplate={currentPriceTemplate}
                    applyDateTemplate={applyDateTemplate}
                />
            )
        },
        [applyDateTemplate, currentPriceTemplate, variantNameTemplate, warehouseTemplate]
    )

    const productNameTemplate = useCallback((rowData: ProductSaleType) => rowData.product_name, [])

    const categoryNameTemplate = useCallback((rowData: ProductSaleType) => rowData?.category?.name, [])

    const brandNameTemplate = useCallback((rowData: ProductSaleType) => rowData?.brand?.name, [])

    const header = useMemo(
        () => (
            <FilterProductSale
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
        return (productsSales?.data?.pagination?.limit as number) * (productsSales?.data?.pagination?.total_page as number)
    }, [productsSales?.data?.pagination?.limit, productsSales?.data?.pagination?.total_page])

    return (
        <div className='w-full'>
            <DataTable
                value={(productsSales?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowVariantTemplate}
                dataKey='id'
                header={header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                className='shadow'
                globalFilter={globalFilter}
            >
                <Column className='pr-0 w-[35px]' expander={allowExpansion} />

                <Column header='SKU' body={skuBodyTemplate} />
                <Column header='Ảnh' body={imageBodyTemplate} />
                <Column className='w-[50%]' field='name' header='Sản phẩm' body={productNameTemplate} />
                <Column field='category' header='Loại sản phẩm' body={categoryNameTemplate} />
                <Column field='brand' header='Thương hiệu' body={brandNameTemplate} />
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
