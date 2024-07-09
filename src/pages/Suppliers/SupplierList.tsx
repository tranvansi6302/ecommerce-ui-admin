import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Fragment, useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { Supplier, SupplierFilter, SupplierStatus } from '~/@types/supplier'
import suppliersApi from '~/apis/supplier.api'
import PATH from '~/constants/path'
import { SUPPLIER_STATUS } from '~/constants/status'
import useQuerySuppliers from '~/hooks/useQuerySuppliers'
import useSetTitle from '~/hooks/useSetTitle'
import { convertSupplierStatus, formatDate } from '~/utils/format'
import FilterSupplier from './components/FilterSupplier'
import { FaCheckDouble } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { MessageResponse } from '~/@types/util'
import MESSAGE from '~/constants/message'
import ShowMessage from '~/components/ShowMessage'
const selectedOptions = [
    { label: 'Chuyển đổi giao dịch', value: 'TOGGLE' },
    {
        label: 'Xóa vĩnh viễn',
        value: 'DELETE'
    }
]
export default function SupplierList() {
    useSetTitle('Danh sách nhà cung cấp')
    const navigate = useNavigate()
    const queryConfig = useQuerySuppliers()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
    const [selectedSupplierStatus, setSelectedSupplierStatus] = useState<SupplierStatus | null>(null)
    const [search, setSearch] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: suppliers, refetch } = useQuery({
        queryKey: ['suppliers', queryConfig],
        queryFn: () => suppliersApi.getAllSuppliers(queryConfig as SupplierFilter),
        staleTime: 3 * 60 * 1000,
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
    const supplierUpdatedAtTemplate = useCallback((rowData: Supplier) => formatDate(rowData.updated_at), [])
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

    const updateManyStatusSupplierMutation = useMutation({
        mutationFn: (data: { supplier_ids: number[] }) => suppliersApi.updateManyStatusSupplier(data),
        onSuccess: (data) => {
            toast.success(`${data.data.message} ${selectedSuppliers.length} dòng dữ liệu`)
            refetch()
            setSelectedSuppliers([])
        },
        onError: (error) => {
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            toast.error(errorResponse?.message ?? '')
        }
    })

    const deleteManySupplierMutation = useMutation({
        mutationFn: (data: { supplier_ids: number[] }) => suppliersApi.deleteManySupplier(data),
        onSuccess: (data) => {
            toast.success(`${data.data.message} ${selectedSuppliers.length} dòng dữ liệu`)
            refetch()
            setSelectedSuppliers([])
        },
        onError: () => {
            toast.error(MESSAGE.NOT_DELETE_CONSTRAINT)
        }
    })

    const handleSelectedOptionChange = (e: DropdownChangeEvent) => {
        switch (e.value) {
            case 'TOGGLE': {
                updateManyStatusSupplierMutation.mutate({ supplier_ids: selectedSuppliers.map((supplier) => supplier.id) })
                break
            }
            case 'DELETE': {
                deleteManySupplierMutation.mutate({ supplier_ids: selectedSuppliers.map((supplier) => supplier.id) })
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
                        Đã chọn {selectedSuppliers.length} dòng trên trang này
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
                        detail='Lưu ý với trường hợp xóa vĩnh viễn chỉ xóa được nhà cung cấp nào không có bắt kì ràng buộc dữ liệu nào, sau khi xóa dữ liệu sẽ không được khôi phục'
                    />
                </div>
            </Fragment>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedSuppliers.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedSuppliers(e.value as Supplier[])
    }, [])

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.SUPPLIER_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (suppliers?.data?.pagination?.limit as number) * (suppliers?.data?.pagination?.total_page as number)
    }, [suppliers?.data?.pagination?.limit, suppliers?.data?.pagination?.total_page])

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

                <Column field='tax_code' header='Mã nhà cung cấp' body={supplierTaxCodeTemplate} />
                <Column field='name' header='Tên nhà cung cấp' body={supplierNameTemplate} />
                <Column field='email' header='Email' body={supplierEmailTemplate} />
                <Column field='phone_number' header='Số điện thoại' body={supplierPhoneTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={supplierStatusTemplate} />
                <Column field='updated_at' header='Cập nhật cuối' body={supplierUpdatedAtTemplate} />
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
