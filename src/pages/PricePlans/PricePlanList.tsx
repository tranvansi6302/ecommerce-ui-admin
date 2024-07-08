import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import warehousesApi from '~/apis/warehouses.api'
import SetProductImage from '~/components/SetProductImage'
import PATH from '~/constants/path'
import useQueryPricePlan from '~/hooks/useQueryPricePlan'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrencyVND, formatDate } from '~/utils/format'
import FilterPricePlan from './components/FilterPricePlan'
import HistoryDialog from './components/HistoryDialog'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function PricePlanList() {
    useSetTitle('Giá đang áp dụng')
    const navigate = useNavigate()
    const queryConfig = useQueryPricePlan()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
    const [search, setSearch] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [openHistory, setOpenHistory] = useState<boolean>(false)
    const [warehouseId, setWarehouseId] = useState<number>(0)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const { data: pricePlansCurrent } = useQuery({
        queryKey: ['price-plans-current', queryConfig],
        queryFn: () => pricesApi.getAllPricePlansCurrent(queryConfig as PricePlanFilter),
        placeholderData: keepPreviousData
    })

    useEffect(() => {
        console.log(pricePlansCurrent?.data.result)
    }, [pricePlansCurrent])

    const variantImageTemplate = useCallback(
        (rowData: PricePlan) => <SetProductImage productImages={rowData.variant.product_images} />,
        []
    )
    const variantNameTemplate = useCallback((rowData: PricePlan) => {
        return (
            <div
                onClick={() => handleOpenHistory(rowData.variant.warehouse.id)}
                className='font-normal text-gray-800 flex flex-col gap-1 cursor-pointer'
            >
                <p className='text-[13.6px] '>{rowData.variant.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.variant.sku}</p>
            </div>
        )
    }, [])
    const salePriceTemplate = useCallback((rowData: PricePlan) => formatCurrencyVND(rowData.sale_price), [])
    const promotionPriceTemplate = useCallback((rowData: PricePlan) => formatCurrencyVND(rowData.promotion_price), [])
    const startDateTemplate = useCallback((rowData: PricePlan) => {
        return rowData.start_date == null ? 'Không áp dụng' : formatDate(rowData.start_date)
    }, [])
    const endDateTemplate = useCallback(
        (rowData: PricePlan) => (rowData.end_date == null ? 'Không áp dụng' : formatDate(rowData.end_date)),
        []
    )

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands(),
        placeholderData: keepPreviousData
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories(),
        placeholderData: keepPreviousData
    })

    const header = useMemo(
        () => (
            <FilterPricePlan
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
            <div className='flex flex-wrap justify-content-between gap-2'>
                <span>Đã chọn {selectedSuppliers.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedSuppliers]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedSuppliers(e.value as Supplier[])
    }, [])

    const handleOpenHistory = (id: number) => {
        setOpenHistory(true)
        setWarehouseId(id)
    }

    const { data: warehouse } = useQuery({
        queryKey: ['warehouse', warehouseId],
        queryFn: () => warehousesApi.getWarehouseById(warehouseId),
        enabled: openHistory
    })

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.PRICE_PLAN_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (
            (pricePlansCurrent?.data?.pagination?.limit as number) * (pricePlansCurrent?.data?.pagination?.total_page as number)
        )
    }, [pricePlansCurrent?.data?.pagination?.limit, pricePlansCurrent?.data?.pagination?.total_page])

    return (
        <div className='w-full'>
            <div className='flex justify-end'>
                <Link to={PATH.PRICE_PLAN_LIST_CREATE} className='inline-block  justify-end mb-2'>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Lên bảng giá</p>
                    </MyButton>
                </Link>
            </div>
            <DataTable
                value={(pricePlansCurrent?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey='id'
                header={selectedSuppliers.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedSuppliers}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[100px]' />
                <Column className='' field='' header='Ảnh' body={variantImageTemplate} />
                <Column className='w-[30%]' field='' header='Tên sản phẩm' body={variantNameTemplate} />
                <Column className='' field='sale_price' header='Giá gốc' body={salePriceTemplate} sortable />
                <Column className='' field='promotion_price' header='Giá khuyến mãi' body={promotionPriceTemplate} sortable />
                <Column className='' field='start_date' header='Ngày hiệu lực' body={startDateTemplate} sortable />
                <Column className='' field='end_date' header='Ngày kết thúc' body={endDateTemplate} sortable />
            </DataTable>
            <HistoryDialog warehouse={warehouse} visible={openHistory} onHide={() => setOpenHistory(false)} />
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
