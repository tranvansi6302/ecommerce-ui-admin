import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Category } from '~/@types/category'
import { ProductFilter } from '~/@types/product'
import categoriesApi from '~/apis/categories.api'

import { Dialog } from 'primereact/dialog'
import { formatDate } from '~/utils/format'
import CreateCategory from './components/CreateCategory'
import FilterCategory from './components/FilterCategory'
import UpdateCategory from './components/UpdateCategory'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function CategoryList() {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [globalFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [categoryId, setCategoryId] = useState<number>(0)

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories(),
        placeholderData: keepPreviousData
    })

    const categoryNameTemplate = useCallback((rowData: Category) => {
        return (
            <p onClick={() => setCategoryUpdate(rowData.id)} className='text-blue-600 cursor-pointer'>
                {rowData.name}
            </p>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const categoryCreatedAtTemplate = useCallback((rowData: Category) => formatDate(rowData.created_at), [])
    const categoryUpdatedAtTemplate = useCallback((rowData: Category) => formatDate(rowData.updated_at), [])

    const header = useMemo(() => <FilterCategory search={search} setSearch={setSearch} />, [search])

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-2'>
                <span>Đã chọn {selectedCategories.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Ngừng kinh doanh']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedCategories]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedCategories(e.value as Category[])
    }, [])

    const setCategoryUpdate = (id: number) => {
        setIsUpdate(true)
        setOpen(true)
        setCategoryId(id)
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
                    <p className='ml-1 text-[16px] '>Thêm loại sản phẩm</p>
                </MyButton>
                <Dialog
                    header={
                        <p className='font-medium text-gray-900'>{isUpdate ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm'}</p>
                    }
                    visible={open}
                    style={{ width: '50vw' }}
                    onHide={() => {
                        if (!open) return
                        setOpen(false)
                    }}
                >
                    <div className='m-0'>
                        {isUpdate ? (
                            <UpdateCategory categoryId={categoryId} setOpen={setOpen} />
                        ) : (
                            <CreateCategory setOpen={setOpen} />
                        )}
                    </div>
                </Dialog>
            </div>
            <DataTable
                value={(categories?.data.result as unknown as DataTableValueArray) ?? []}
                dataKey='id'
                header={selectedCategories.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedCategories}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[100px]' />

                <Column className='w-2/5' field='name' header='Tên danh mục' body={categoryNameTemplate} />
                <Column field='created_at' header='Ngày khởi tạo' sortable body={categoryCreatedAtTemplate} />
                <Column field='updated_at' header='Cập nhật cuối' sortable body={categoryUpdatedAtTemplate} />
            </DataTable>
        </div>
    )
}
