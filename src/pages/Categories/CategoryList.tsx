import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import MyButton from '~/components/MyButton'

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Category, CategoryFilter } from '~/@types/category'
import { ProductFilter } from '~/@types/product'
import categoriesApi from '~/apis/categories.api'

import { Dialog } from 'primereact/dialog'
import { formatDate } from '~/utils/format'
import CreateCategory from './components/CreateCategory'
import FilterCategory from './components/FilterCategory'
import UpdateCategory from './components/UpdateCategory'
import useSetTitle from '~/hooks/useSetTitle'
import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryCategories from '~/hooks/useQueryCategories'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import PATH from '~/constants/path'
import { FaCheckDouble } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { CategoryStatus } from './components/FilterCategory/FilterCategory'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

const selectedOptions = [{ label: 'Chuyển đổi ngừng kinh doanh', value: 'TOGGLE' }]

export default function CategoryList() {
    useSetTitle('Danh sách loại sản phẩm')
    const navigate = useNavigate()
    const queryConfig = useQueryCategories()
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [globalFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const [selectedCategoryStatus, setSelectedCategoryStatus] = useState<CategoryStatus | null>(null)

    const { data: categories, refetch } = useQuery({
        queryKey: ['categories', queryConfig],
        queryFn: () => categoriesApi.getAllCategories(queryConfig as CategoryFilter),
        staleTime: 3 * 60 * 1000,
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
    const categoryStatusTemplate = useCallback((rowData: Category) => {
        return (
            <MyButton text severity={rowData.status === 'INACTIVE' ? 'danger' : 'success'}>
                <p className='text-[13.6px] font-medium'>{rowData.status == 'ACTIVE' ? 'ĐANG KINH DOANH' : 'NGỪNG KINH DOANH'}</p>
            </MyButton>
        )
    }, [])
    const categoryCreatedAtTemplate = useCallback((rowData: Category) => formatDate(rowData.created_at), [])
    const categoryUpdatedAtTemplate = useCallback((rowData: Category) => formatDate(rowData.updated_at), [])

    const header = useMemo(
        () => (
            <FilterCategory
                selectedCategoryStatus={selectedCategoryStatus}
                setSelectedCategoryStatus={setSelectedCategoryStatus}
                search={search}
                setSearch={setSearch}
            />
        ),
        [search, selectedCategoryStatus]
    )
    const updateManyStatusCategoryMutation = useMutation({
        mutationFn: (data: { category_ids: number[] }) => categoriesApi.updateManyStatusCategory(data),
        onSuccess: (data) => {
            toast.success(data.data.message)
            refetch()
            setSelectedCategories([])
        }
    })
    const handleSelectedOptionChange = (e: DropdownChangeEvent) => {
        switch (e.value) {
            case 'TOGGLE': {
                const categoryIds = selectedCategories.map((category) => category.id)
                updateManyStatusCategoryMutation.mutate({ category_ids: categoryIds })
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
                    Đã chọn {selectedCategories.length} dòng trên trang này
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
        [selectedCategories.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedCategories(e.value as Category[])
    }, [])

    const setCategoryUpdate = (id: number) => {
        setIsUpdate(true)
        setOpen(true)
        setCategoryId(id)
    }

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.CATEGORY_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (categories?.data?.pagination?.limit as number) * (categories?.data?.pagination?.total_page as number)
    }, [categories?.data?.pagination?.limit, categories?.data?.pagination?.total_page])

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

                <Column field='name' header='Tên danh mục' body={categoryNameTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={categoryStatusTemplate} />
                <Column field='created_at' header='Ngày khởi tạo' sortable body={categoryCreatedAtTemplate} />
                <Column field='updated_at' header='Cập nhật cuối' sortable body={categoryUpdatedAtTemplate} />
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
