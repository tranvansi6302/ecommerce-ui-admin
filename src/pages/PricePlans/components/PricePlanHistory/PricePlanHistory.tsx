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
import { Link } from 'react-router-dom'
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
export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function PricePlanHistory() {
    useSetTitle('Lịch sử thay đổi')
    const queryConfig = useQueryPricePlan()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
    const [search, setSearch] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const { data: pricePlansHistory } = useQuery({
        queryKey: ['price-plans-history', queryConfig],
        queryFn: () => pricesApi.getAllPricePlansHistory(queryConfig as PricePlanFilter),
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
                <Column className='w-[20%]' field='' header='Tên sản phẩm' body={variantNameTemplate} />
                <Column className='' field='sale_price' header='Giá gốc' body={salePriceTemplate} sortable />
                <Column className='' field='promotion_price' header='Giá khuyến mãi' body={promotionPriceTemplate} sortable />
                <Column className='' field='start_date' header='Ngày hiệu lực' body={startDateTemplate} sortable />
                <Column className='' field='end_date' header='Ngày kết thúc' body={endDateTemplate} sortable />
                <Column className='' field='updated_at' header='Ngày cập nhật' body={updatedAtTemplate} sortable />
            </DataTable>
        </div>
    )
}
