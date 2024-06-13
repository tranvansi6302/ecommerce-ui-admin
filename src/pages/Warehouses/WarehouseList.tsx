import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MyButton from '~/components/MyButton'
import PATH from '~/constants/path'

import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Warehouse, WarehouseFilter } from '~/@types/warehouse'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import warehousesApi from '~/apis/warehouses.api'
import DefaultProductImage from '~/components/DefaultProductImage'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrencyVND, formatDate } from '~/utils/format'
import FilterWarehouse from './components/FilterWarehouse'
import useQueryWarehouse from '~/hooks/useQueryWarehouse'

export default function WarehouseList() {
    useSetTitle('Tồn kho')
    const [globalFilter] = useState<string>('')
    const queryConfig = useQueryWarehouse()
    const [selectedWarehouses, setSelectedWarehouses] = useState<Warehouse[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [search, setSearch] = useState<string>('')

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses', queryConfig],
        queryFn: () => warehousesApi.getAllWarehouses(queryConfig as WarehouseFilter),
        placeholderData: keepPreviousData
    })

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

    const warehouseImageTemplate = useCallback(
        () => (
            <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                <DefaultProductImage height='28px' />
            </div>
        ),
        []
    )

    const warehouseNameTemplate = useCallback((rowData: Warehouse) => {
        return (
            <div className='font-normal text-gray-800 flex flex-col gap-1'>
                <p className='text-[13.6px] '>{rowData.variant.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.sku}</p>
            </div>
        )
    }, [])

    const warehouseAvailableQuantityTemplate = useCallback((rowData: Warehouse) => rowData.available_quantity, [])
    const warehouseTotalQuantityTemplate = useCallback((rowData: Warehouse) => rowData.total_quantity, [])
    const warehousePurchasePriceTemplate = useCallback(
        (rowData: Warehouse) => formatCurrencyVND(rowData.variant.warehouse.purchase_price),
        []
    )
    const warehouseLastUpdatedTemplate = useCallback((rowData: Warehouse) => formatDate(rowData.last_updated), [])

    const header = useMemo(
        () => (
            <FilterWarehouse
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
                <span>Đã chọn {selectedWarehouses.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedWarehouses]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedWarehouses(e.value as Warehouse[])
    }, [])

    return (
        <div className='w-full'>
            <Link to={PATH.PURCHASE_CREATE} className='flex items-center justify-end mb-2'>
                <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                    <p className='ml-1 text-[16px] '>Tạo đơn hàng</p>
                </MyButton>
            </Link>
            <DataTable
                value={(warehouses?.data.result as unknown as DataTableValueArray) ?? []}
                dataKey='id'
                header={selectedWarehouses.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedWarehouses}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[80px]' />

                <Column className='' header='Ảnh' body={warehouseImageTemplate} />
                <Column className='w-[35%]' header='Tên phiên bản sản phẩm' body={warehouseNameTemplate} />
                <Column
                    field='available_quantity'
                    className=''
                    header='Tồn kho'
                    body={warehouseAvailableQuantityTemplate}
                    sortable
                />
                <Column
                    field='total_quantity'
                    className=''
                    header='Tổng số lượng'
                    body={warehouseTotalQuantityTemplate}
                    sortable
                />
                <Column
                    field='variant.warehouse.purchase_price'
                    className=''
                    header='Giá nhập'
                    body={warehousePurchasePriceTemplate}
                    sortable
                />
                <Column field='last_updated' className='' header='Cập nhật cuối' body={warehouseLastUpdatedTemplate} sortable />
            </DataTable>
        </div>
    )
}
