import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { Dialog } from 'primereact/dialog'
import { Brand } from '~/@types/brand'
import brandsApi from '~/apis/brands.api'
import useSetTitle from '~/hooks/useSetTitle'
import { formatDate } from '~/utils/format'
import CreateBrand from './components/CreateBrand'
import FilterBrand from './components/FilterBrand'
import UpdateBrand from './components/UpdateBrand'

export default function BrandList() {
    useSetTitle('Danh sách thương hiệu')
    const [selectedBrand, setSelectedBrand] = useState<Brand[]>([])
    const [globalFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [brandId, setBrandId] = useState<number>(0)

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands(),
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

    const brandCreatedAtTemplate = useCallback((rowData: Brand) => formatDate(rowData.created_at), [])
    const brandUpdatedAtTemplate = useCallback((rowData: Brand) => formatDate(rowData.updated_at), [])

    const header = useMemo(() => <FilterBrand search={search} setSearch={setSearch} />, [search])

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-2'>
                <span>Đã chọn {selectedBrand.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedBrand]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedBrand(e.value as Brand[])
    }, [])

    const setBrandUpdate = (id: number) => {
        setIsUpdate(true)
        setOpen(true)
        setBrandId(id)
    }

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
                <Column field='created_at' header='Ngày khởi tạo' sortable body={brandCreatedAtTemplate} />
                <Column field='updated_at' header='Cập nhật cuối' sortable body={brandUpdatedAtTemplate} />
            </DataTable>
        </div>
    )
}
