import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { useCallback, useMemo, useState } from 'react'
import { FaCheckDouble } from 'react-icons/fa'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { PurchaseOrder, PurchaseOrderFilter, PurchaseOrderStatus } from '~/@types/purchase'
import { Supplier } from '~/@types/supplier'
import purchasesApi from '~/apis/purchases.api'
import MyButton from '~/components/MyButton'
import PATH from '~/constants/path'
import { PURCHASE_ORDER_STATUS } from '~/constants/status'
import useQueryPurchaseOrders from '~/hooks/useQueryPurchaseOrders'
import useSetTitle from '~/hooks/useSetTitle'
import { convertPurchaseOrderStatus, formatDate } from '~/utils/format'
import FilterPurchaseOrder from './components/FilterPurchaseOrder'

export default function PurchaseOrderList() {
    useSetTitle('Danh sách đơn hàng')
    const navigate = useNavigate()
    const queryConfig = useQueryPurchaseOrders()
    const [globalFilter] = useState<string>('')
    const [selectedPurchaseOrders, setSelectedPurchaseOrders] = useState<PurchaseOrder[]>([])
    const [search, setSearch] = useState<string>('')
    const [selectedPurchaseOrderStatus, setSelectedPurchaseOrderStatus] = useState<PurchaseOrderStatus | null>(null)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const { data: purchaseOrders } = useQuery({
        queryKey: ['purchaseOrders', queryConfig],
        queryFn: () => purchasesApi.getAllPurchaseOrders(queryConfig as PurchaseOrderFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    const purchaseOrdersCodeTemplate = useCallback((rowData: PurchaseOrder) => {
        return (
            <Link to={`${PATH.PURCHASE_LIST}/${rowData.id}`} className='text-blue-600 cursor-pointer'>
                {rowData.purchase_order_code}
            </Link>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const purchaseOrdersDateTemplate = useCallback((rowData: PurchaseOrder) => formatDate(rowData.purchase_order_date), [])
    const purchaseOrdersSupplierTemplate = useCallback((rowData: PurchaseOrder) => rowData.supplier.name, [])
    const purchaseOrderStatusTemplate = useCallback((rowData: PurchaseOrder) => {
        return (
            <MyButton
                text
                severity={
                    rowData.status === PURCHASE_ORDER_STATUS.CANCELLED
                        ? 'danger'
                        : rowData.status === PURCHASE_ORDER_STATUS.COMPLETED
                          ? 'success'
                          : 'warning'
                }
            >
                <p className='text-[13.6px] font-medium'>{convertPurchaseOrderStatus(rowData.status).toUpperCase()}</p>
            </MyButton>
        )
    }, [])

    const header = useMemo(
        () => (
            <FilterPurchaseOrder
                search={search}
                setSearch={setSearch}
                selectedSupplier={selectedSupplier}
                setSelectedSupplier={setSelectedSupplier}
                selectedPurchaseOrderStatus={selectedPurchaseOrderStatus}
                setSelectedPurchaseOrderStatus={setSelectedPurchaseOrderStatus}
            />
        ),
        [search, selectedPurchaseOrderStatus, selectedSupplier]
    )

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                    <FaCheckDouble />
                    Đã chọn {selectedPurchaseOrders.length} dòng trên trang này
                </span>
                <Dropdown
                    style={{ width: '300px' }}
                    className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                    placeholder='Chưa có hành động nào trên trang này'
                />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedPurchaseOrders.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedPurchaseOrders(e.value as PurchaseOrder[])
    }, [])

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.PURCHASE_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (purchaseOrders?.data?.pagination?.limit as number) * (purchaseOrders?.data?.pagination?.total_page as number)
    }, [purchaseOrders?.data?.pagination?.limit, purchaseOrders?.data?.pagination?.total_page])
    return (
        <div className='w-full'>
            <div className='flex justify-end'>
                <Link to={PATH.PURCHASE_CREATE} className='inline-block  mb-2'>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Tạo đơn hàng</p>
                    </MyButton>
                </Link>
            </div>
            <DataTable
                value={(purchaseOrders?.data.result as unknown as DataTableValueArray) ?? []}
                dataKey='id'
                header={selectedPurchaseOrders.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedPurchaseOrders}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[100px]' />
                <Column className='' header='Mã đơn' body={purchaseOrdersCodeTemplate} />
                <Column className='' header='Ngày đặt hàng' body={purchaseOrdersDateTemplate} />
                <Column className='' header='Nhà cung cấp' body={purchaseOrdersSupplierTemplate} />
                <Column className='pl-0' header='Trạng thái' body={purchaseOrderStatusTemplate} />
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
