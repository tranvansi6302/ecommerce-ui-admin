import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { Dialog } from 'primereact/dialog'
import { Brand, BrandFilter } from '~/@types/brand'
import brandsApi from '~/apis/brands.api'
import useSetTitle from '~/hooks/useSetTitle'
import { formatDate } from '~/utils/format'
import CreateBrand from './components/CreateBrand'
import FilterBrand from './components/FilterBrand'
import UpdateBrand from './components/UpdateBrand'
import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryBrands from '~/hooks/useQueryBrands'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import PATH from '~/constants/path'
import { BrandStatus } from './components/FilterBrand/FilterBrand'
import { FaCheckDouble } from 'react-icons/fa'
import { toast } from 'react-toastify'
const selectedOptions = [{ label: 'Chuyển đổi ngừng kinh doanh', value: 'TOGGLE' }]
export default function BrandList() {
    useSetTitle('Danh sách thương hiệu')
    const navigate = useNavigate()
    const queryConfig = useQueryBrands()
    const [selectedBrand, setSelectedBrand] = useState<Brand[]>([])
    const [globalFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [brandId, setBrandId] = useState<number>(0)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const [selectedBrandStatus, setSelectedBrandStatus] = useState<BrandStatus | null>(null)

    const { data: brands, refetch } = useQuery({
        queryKey: ['brands', queryConfig],
        queryFn: () => brandsApi.getAllBrands(queryConfig as BrandFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    const brandNameTemplate = useCallback((rowData: Brand) => {
        return (
            <p onClick={() => setBrandUpdate(rowData.id)} className='text-blue-600 cursor-pointer'>
                {rowData.name}
            </p>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const brandStatusTemplate = useCallback((rowData: Brand) => {
        return (
            <MyButton text severity={rowData.status === 'INACTIVE' ? 'danger' : 'success'}>
                <p className='text-[13.6px] font-medium'>{rowData.status == 'ACTIVE' ? 'ĐANG KINH DOANH' : 'NGỪNG KINH DOANH'}</p>
            </MyButton>
        )
    }, [])
    const brandCreatedAtTemplate = useCallback((rowData: Brand) => formatDate(rowData.created_at), [])
    const brandUpdatedAtTemplate = useCallback((rowData: Brand) => formatDate(rowData.updated_at), [])

    const header = useMemo(
        () => (
            <FilterBrand
                selectedBrandStatus={selectedBrandStatus}
                setSelectedBrandStatus={setSelectedBrandStatus}
                search={search}
                setSearch={setSearch}
            />
        ),
        [search, selectedBrandStatus]
    )

    const updateManyStatusBrandMutation = useMutation({
        mutationFn: (data: { brand_ids: number[] }) => brandsApi.updateManyStatusBrand(data),
        onSuccess: (data) => {
            toast.success(data.data.message)
            refetch()
            setSelectedBrand([])
        }
    })

    const handleSelectedOptionChange = (e: DropdownChangeEvent) => {
        switch (e.value) {
            case 'TOGGLE': {
                const brandIds = selectedBrand.map((brand) => brand.id)
                updateManyStatusBrandMutation.mutate({ brand_ids: brandIds })
                break
            }
            default:
                break
        }
    }

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                    <FaCheckDouble />
                    Đã chọn {selectedBrand.length} dòng trên trang này
                </span>
                <Dropdown
                    style={{ width: '300px' }}
                    className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                    options={selectedOptions}
                    onChange={handleSelectedOptionChange}
                    placeholder='Chọn thao tác'
                />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedBrand.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedBrand(e.value as Brand[])
    }, [])

    const setBrandUpdate = (id: number) => {
        setIsUpdate(true)
        setOpen(true)
        setBrandId(id)
    }

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.BRAND_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (brands?.data?.pagination?.limit as number) * (brands?.data?.pagination?.total_page as number)
    }, [brands?.data?.pagination?.limit, brands?.data?.pagination?.total_page])
    return (
        <div className='w-full'>
            <div className='flex items-center justify-end mb-2'>
                <MyButton
                    onClick={() => {
                        setOpen(true)
                        setIsUpdate(false)
                    }}
                    icon='pi pi-plus'
                    className='px-6 py-3 rounded-none'
                >
                    <p className='ml-1 text-[16px] '>Thêm thương hiệu</p>
                </MyButton>
                <Dialog
                    header={<p className='font-medium text-gray-900'>{isUpdate ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu'}</p>}
                    visible={open}
                    style={{ width: '50vw' }}
                    onHide={() => {
                        if (!open) return
                        setOpen(false)
                    }}
                >
                    <div className='m-0'>
                        {isUpdate ? <UpdateBrand brandId={brandId} setOpen={setOpen} /> : <CreateBrand setOpen={setOpen} />}
                    </div>
                </Dialog>
            </div>
            <DataTable
                value={(brands?.data.result as unknown as DataTableValueArray) ?? []}
                dataKey='id'
                header={selectedBrand.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedBrand}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[100px]' />

                <Column className='w-2/5' field='name' header='Tên danh mục' body={brandNameTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={brandStatusTemplate} />
                <Column field='created_at' header='Ngày khởi tạo' sortable body={brandCreatedAtTemplate} />
                <Column field='updated_at' header='Cập nhật cuối' sortable body={brandUpdatedAtTemplate} />
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
