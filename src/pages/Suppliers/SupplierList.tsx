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

import { Supplier, SupplierStatus } from '~/@types/supplier'
import suppliersApi from '~/apis/supplier.api'
import { Link } from 'react-router-dom'
import PATH from '~/constants/path'
import { convertSupplierStatus } from '~/utils/format'
import { SUPPLIER_STATUS } from '~/constants/status'
import FilterSupplier from './components/FilterSupplier'
import useSetTitle from '~/hooks/useSetTitle'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function SupplierList() {
    useSetTitle('Danh sách nhà cung cấp')
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
    const [selectedSupplierStatus, setSelectedSupplierStatus] = useState<SupplierStatus | null>(null)
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
        return (
            <MyButton text severity={rowData.status === SUPPLIER_STATUS.INACTIVE ? 'danger' : 'success'}>
                <p className='text-[13.6px] font-medium'>{convertSupplierStatus(rowData.status).toUpperCase()}</p>
            </MyButton>
        )
    }, [])

    const header = useMemo(
        () => (
            <FilterSupplier
                selectedSupplierStatus={selectedSupplierStatus}
                setSelectedSupplierStatus={setSelectedSupplierStatus}
                search={search}
                setSearch={setSearch}
            />
        ),
        [search, selectedSupplierStatus]
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
                <Link to={PATH.SUPPLIER_CREATE} className='mb-2 inline-block'>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Thêm nhà cung cấp</p>
                    </MyButton>
                </Link>
            </div>
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
                <Column className='pl-0' field='status' header='Trạng thái' body={supplierStatusTemplate} />
            </DataTable>
        </div>
    )
}
