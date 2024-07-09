import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { PricePlan, PricePlanFilter } from '~/@types/price'
import { ProductFilter } from '~/@types/product'
import { Supplier } from '~/@types/supplier'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import pricesApi from '~/apis/prices.api'
import SetProductImage from '~/components/SetProductImage'
import PATH from '~/constants/path'
import useQueryPricePlan from '~/hooks/useQueryPricePlan'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrencyVND, formatDate } from '~/utils/format'
import FilterPricePlan from '../FilterPricePlan'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { FaCheckDouble } from 'react-icons/fa'
export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function PricePlanHistory() {
    useSetTitle('Lịch sử thay đổi')
    const navigate = useNavigate()
    const queryConfig = useQueryPricePlan()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedHistoryPlan, setSelectedHistoryPlan] = useState<Supplier[]>([])
    const [search, setSearch] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const { data: pricePlansHistory } = useQuery({
        queryKey: ['price-plans-history', queryConfig],
        queryFn: () => pricesApi.getAllPricePlansHistory(queryConfig as PricePlanFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    const variantImageTemplate = useCallback(
        (rowData: PricePlan) => <SetProductImage productImages={rowData.variant.product_images} />,
        []
    )
    const variantNameTemplate = useCallback((rowData: PricePlan) => {
        return (
            <div className='font-normal text-gray-800 flex flex-col gap-1'>
                <p className='text-[13.6px] '>{rowData.variant.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.variant.sku}</p>
            </div>
        )
    }, [])
    const salePriceTemplate = useCallback(
        (rowData: PricePlan) => (rowData.sale_price ? formatCurrencyVND(rowData.sale_price) : 'Không áp dụng'),
        []
    )
    const promotionPriceTemplate = useCallback(
        (rowData: PricePlan) => (rowData.promotion_price ? formatCurrencyVND(rowData.promotion_price) : 'Không áp dụng'),
        []
    )
    const startDateTemplate = useCallback(
        (rowData: PricePlan) => (rowData.start_date == null ? 'Không áp dụng' : formatDate(rowData.start_date)),
        []
    )
    const endDateTemplate = useCallback(
        (rowData: PricePlan) => (rowData.end_date == null ? 'Không áp dụng' : formatDate(rowData.end_date)),
        []
    )
    const updatedAtTemplate = useCallback((rowData: PricePlan) => formatDate(rowData.updated_at), [])

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

    const header = useMemo(
        () => (
            <FilterPricePlan
                isHistory
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
        [brands?.data.result, categories?.data.result, search, selectedBrand, selectedCategory]
    )

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                    <FaCheckDouble />
                    Đã chọn {selectedHistoryPlan.length} dòng trên trang này
                </span>
                <Dropdown
                    style={{ width: '300px' }}
                    className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                    placeholder='Chưa có hành động nào trên trang này'
                />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedHistoryPlan.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedHistoryPlan(e.value as Supplier[])
    }, [])

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.PRICE_PLAN_LIST_HISTORY,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (
            (pricePlansHistory?.data?.pagination?.limit as number) * (pricePlansHistory?.data?.pagination?.total_page as number)
        )
    }, [pricePlansHistory?.data?.pagination?.limit, pricePlansHistory?.data?.pagination?.total_page])

    return (
        <div className='w-full'>
            <div className='flex justify-end'>
                <Link to={PATH.PRICE_PLAN_LIST_CREATE} className=' inline-block justify-end mb-2'>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Lên bảng giá</p>
                    </MyButton>
                </Link>
            </div>
            <DataTable
                value={(pricePlansHistory?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey='id'
                header={selectedHistoryPlan.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedHistoryPlan}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[80px]' />

                <Column className='' field='' header='Ảnh' body={variantImageTemplate} />
                <Column className='w-[20%]' field='' header='Tên sản phẩm' body={variantNameTemplate} />
                <Column className='' field='sale_price' header='Giá bán' body={salePriceTemplate} sortable />
                <Column className='' field='promotion_price' header='Giá khuyến mãi' body={promotionPriceTemplate} sortable />
                <Column className='' field='start_date' header='Ngày hiệu lực' body={startDateTemplate} sortable />
                <Column className='' field='end_date' header='Ngày kết thúc' body={endDateTemplate} sortable />
                <Column className='' field='updated_at' header='Ngày cập nhật' body={updatedAtTemplate} sortable />
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
