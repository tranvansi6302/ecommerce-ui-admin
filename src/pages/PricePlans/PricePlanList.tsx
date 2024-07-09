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
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Dialog } from 'primereact/dialog'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { useForm } from 'react-hook-form'
import { FaCheckDouble } from 'react-icons/fa'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { PricePlan, PricePlanFilter } from '~/@types/price'
import { ProductFilter } from '~/@types/product'
import { Supplier } from '~/@types/supplier'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import pricesApi from '~/apis/prices.api'
import warehousesApi from '~/apis/warehouses.api'
import MyInput from '~/components/MyInput'
import SetProductImage from '~/components/SetProductImage'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useQueryPricePlan from '~/hooks/useQueryPricePlan'
import useSetTitle from '~/hooks/useSetTitle'
import { formatCurrencyVND, formatDate } from '~/utils/format'
import FilterPricePlan from './components/FilterPricePlan'
import HistoryDialog from './components/HistoryDialog'
import { AxiosError } from 'axios'
import { MessageResponse } from '~/@types/util'
import { toast } from 'react-toastify'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

type UpdatePriceForm = {
    sale_price: string
    promotion_price: string
}
export default function PricePlanList() {
    useSetTitle('Giá đang áp dụng')
    const navigate = useNavigate()
    const queryConfig = useQueryPricePlan()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedPricePlan, setSelectedPricePlan] = useState<Supplier[]>([])
    const [search, setSearch] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [openHistory, setOpenHistory] = useState<boolean>(false)
    const [warehouseId, setWarehouseId] = useState<number>(0)
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)
    const [openChangePrice, setOpenChangePrice] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [changePricePlan, setChangePricePlan] = useState<PricePlan | null>(null)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<UpdatePriceForm>()

    const { data: pricePlansCurrent, refetch } = useQuery({
        queryKey: ['price-plans-current', queryConfig],
        queryFn: () => pricesApi.getAllPricePlansCurrent(queryConfig as PricePlanFilter),
        staleTime: 3 * 60 * 1000,
        placeholderData: keepPreviousData
    })

    const variantImageTemplate = useCallback(
        (rowData: PricePlan) => <SetProductImage productImages={rowData.variant.product_images} />,
        []
    )
    const variantNameTemplate = useCallback((rowData: PricePlan) => {
        return (
            <div
                onClick={() => handleOpenHistory(rowData.variant.warehouse.id)}
                className='font-normal text-gray-800 flex flex-col gap-1 cursor-pointer'
            >
                <p className='text-[13.6px] '>{rowData.variant.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.variant.sku}</p>
            </div>
        )
    }, [])
    const salePriceTemplate = useCallback((rowData: PricePlan) => formatCurrencyVND(rowData.sale_price), [])
    const promotionPriceTemplate = useCallback((rowData: PricePlan) => formatCurrencyVND(rowData.promotion_price), [])
    const startDateTemplate = useCallback((rowData: PricePlan) => {
        return rowData.start_date == null ? 'Không áp dụng' : formatDate(rowData.start_date)
    }, [])
    const endDateTemplate = useCallback(
        (rowData: PricePlan) => (rowData.end_date == null ? 'Không áp dụng' : formatDate(rowData.end_date)),
        []
    )

    const changePriceTemplate = useCallback((rowData: PricePlan) => {
        return (
            <MyButton onClick={() => onOpenChangePrice(rowData)} outlined severity='info'>
                <p className='text-[13.6px] font-normal'>Thay đổi giá</p>
            </MyButton>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands({ status: 'ACTIVE' }),
        placeholderData: keepPreviousData
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories({ status: 'ACTIVE' }),
        placeholderData: keepPreviousData
    })

    const header = useMemo(
        () => (
            <FilterPricePlan
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
            <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                    <FaCheckDouble />
                    Đã chọn {selectedPricePlan.length} dòng trên trang này
                </span>
                <Dropdown
                    style={{ width: '300px' }}
                    className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                    placeholder='Chưa có hành động nào trên trang này'
                />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedPricePlan.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedPricePlan(e.value as Supplier[])
    }, [])

    const handleOpenHistory = (id: number) => {
        setOpenHistory(true)
        setWarehouseId(id)
    }

    const { data: warehouse } = useQuery({
        queryKey: ['warehouse', warehouseId],
        queryFn: () => warehousesApi.getWarehouseById(warehouseId),
        enabled: openHistory
    })

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.PRICE_PLAN_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (
            (pricePlansCurrent?.data?.pagination?.limit as number) * (pricePlansCurrent?.data?.pagination?.total_page as number)
        )
    }, [pricePlansCurrent?.data?.pagination?.limit, pricePlansCurrent?.data?.pagination?.total_page])

    // Handle change price
    const onOpenChangePrice = (rowData: PricePlan) => {
        setValue('sale_price', rowData.sale_price ? rowData.sale_price.toString() : '0')
        setValue('promotion_price', rowData.promotion_price ? rowData.promotion_price.toString() : '0')
        setChangePricePlan(rowData)
        setOpenChangePrice(true)
        setErrorMessage('')
    }
    const updatePricePlanMutation = useMutation({
        mutationFn: (data: UpdatePriceForm) => pricesApi.updatePricePlan(changePricePlan?.id as number, data),
        onSuccess: (data) => {
            toast.success(data.data.message)
            refetch()
            setOpenChangePrice(false)
            setChangePricePlan(null)
        },
        onError: (error) => {
            const errorResponse = (error as AxiosError<MessageResponse>).response?.data
            setErrorMessage(errorResponse?.message ?? '')
        }
    })
    const onSubmit = handleSubmit((data) => {
        console.log(data)
        if (data.sale_price == '' && data.promotion_price == '') {
            setErrorMessage(MESSAGE.INVALID_PRICE)
        } else if (Number(data.sale_price) < Number(data.promotion_price)) {
            setErrorMessage(MESSAGE.INVALID_PROMOTION_PRICE_GREATER_THAN_SALE_PRICE)
        } else {
            setErrorMessage('')
            const finalData = {
                sale_price:
                    data.sale_price === '' ? (changePricePlan?.sale_price.toString() as string) : (data.sale_price as string),
                promotion_price:
                    data.promotion_price === ''
                        ? (changePricePlan?.promotion_price.toString() as string)
                        : (data.promotion_price as string)
            }
            updatePricePlanMutation.mutate(finalData)
        }
    })

    return (
        <div className='w-full'>
            <Dialog
                header={<p className='font-medium'>Thay đổi giá bán</p>}
                visible={openChangePrice}
                style={{ width: '40vw' }}
                onHide={() => {
                    reset()
                    setOpenChangePrice(false)
                }}
            >
                <form onSubmit={onSubmit} className='p-fluid'>
                    {errorMessage && <ShowMessage detail={errorMessage} severity='warn' />}
                    <div className='field mt-4'>
                        <MyInput
                            keyFilter='pint'
                            register={register}
                            errors={errors}
                            name='sale_price'
                            label='Giá bán'
                            placeholder='Nhập giá bán'
                            className='w-full h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                            classNameLabel='text-[13.6px]'
                            style={{ fontSize: '13.6px' }}
                            styleMessage={{ fontSize: '13px' }}
                        />
                    </div>

                    <div className='field mt-4'>
                        <MyInput
                            keyFilter='pint'
                            register={register}
                            errors={errors}
                            name='promotion_price'
                            label='Giá khuyến mãi'
                            placeholder='Nhập giá khuyến mãi'
                            className='w-full h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                            classNameLabel='text-[13.6px]'
                            style={{ fontSize: '13.6px' }}
                            styleMessage={{ fontSize: '13px' }}
                        />
                    </div>

                    <div className='flex justify-end gap-4 pt-6'>
                        <MyButton
                            type='button'
                            className='rounded-[3px] h-9'
                            outlined
                            onClick={() => {
                                reset()
                                setOpenChangePrice(false)
                            }}
                        >
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>

                        <MyButton loading={updatePricePlanMutation.isPending} type='submit' className='rounded-[3px] h-9 w-36'>
                            <p className='font-semibold text-[14px]'>Xác nhận</p>
                        </MyButton>
                    </div>
                </form>
            </Dialog>
            <div className='flex justify-end'>
                <Link to={PATH.PRICE_PLAN_LIST_CREATE} className='inline-block  justify-end mb-2'>
                    <MyButton icon='pi pi-plus' className='px-6 py-3 rounded-none'>
                        <p className='ml-1 text-[16px] '>Lên bảng giá</p>
                    </MyButton>
                </Link>
            </div>
            <DataTable
                value={(pricePlansCurrent?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey='id'
                header={selectedPricePlan.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedPricePlan}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[50px]' />
                <Column className='' field='' header='Ảnh' body={variantImageTemplate} />
                <Column className='w-[30%]' field='' header='Tên sản phẩm' body={variantNameTemplate} />
                <Column className='' field='sale_price' header='Giá bán' body={salePriceTemplate} sortable />
                <Column className='' field='promotion_price' header='Giá khuyến mãi' body={promotionPriceTemplate} sortable />
                <Column className='' field='start_date' header='Ngày hiệu lực' body={startDateTemplate} sortable />
                <Column className='' field='end_date' header='Ngày kết thúc' body={endDateTemplate} sortable />
                <Column className='' field='' header='Thao tác' body={changePriceTemplate} />
            </DataTable>
            <HistoryDialog warehouse={warehouse} visible={openHistory} onHide={() => setOpenHistory(false)} />
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
