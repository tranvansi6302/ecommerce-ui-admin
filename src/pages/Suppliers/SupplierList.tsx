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
import { ProductFilter } from '~/@types/product'

import { Supplier } from '~/@types/supplier'
import suppliersApi from '~/apis/supplier.api'
import FilterSupplier from './components/FilterSupplier'
import { Link } from 'react-router-dom'
import PATH from '~/constants/path'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function SupplierList() {
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
    const [search, setSearch] = useState<string>('')

    const { data: suppliers } = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => suppliersApi.getAllSuppliers(),
        placeholderData: keepPreviousData
    })

    const supplierTaxCodeTemplate = useCallback((rowData: Supplier) => {
        return (
            <Link to={`${PATH.SUPPLIER_LIST}/${rowData.id}`} className='text-blue-600 cursor-pointer'>
                {rowData.tax_code}
            </Link>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const supplierNameTemplate = useCallback((rowData: Supplier) => rowData.name, [])
    const supplierEmailTemplate = useCallback((rowData: Supplier) => rowData.email, [])
    const supplierPhoneTemplate = useCallback((rowData: Supplier) => rowData.phone_number, [])
    const supplierStatusTemplate = useCallback((rowData: Supplier) => {
        if (rowData.status == 'INACTIVE') {
            return (
                <MyButton text severity='danger'>
                    <p className='text-[13.6px] font-medium'>Ngừng giao dịch</p>
                </MyButton>
            )
        }
        if (rowData.status == 'ACTIVE') {
            return (
                <MyButton text severity='success'>
                    <p className='text-[13.6px] font-medium'>Đang giao dịch</p>
                </MyButton>
            )
        }
    }, [])

    const header = useMemo(() => <FilterSupplier search={search} setSearch={setSearch} />, [search])

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
            <Link to={PATH.SUPPLIER_CREATE} className='flex items-center justify-end mb-2'>
                <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                    <p className='ml-1 text-[16px] '>Thêm nhà cung cấp</p>
                </MyButton>
            </Link>
            <DataTable
                value={(suppliers?.data.result as unknown as DataTableValueArray) ?? []}
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

                <Column className='' field='tax_code' header='Mã nhà cung cấp' body={supplierTaxCodeTemplate} />
                <Column className='' field='name' header='Tên nhà cung cấp' body={supplierNameTemplate} />
                <Column className='' field='email' header='Email' body={supplierEmailTemplate} />
                <Column className='' field='phone_number' header='Số điện thoại' body={supplierPhoneTemplate} />
                <Column className='' field='status' header='Trạng thái' body={supplierStatusTemplate} />
            </DataTable>
        </div>
    )
}
