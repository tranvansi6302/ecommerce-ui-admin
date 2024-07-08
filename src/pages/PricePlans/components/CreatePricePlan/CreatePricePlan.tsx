import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable, DataTableValueArray } from 'primereact/datatable'
import { Nullable } from 'primereact/ts-helpers'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LiaTimesSolid } from 'react-icons/lia'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import { Variant } from '~/@types/variant'
import pricesApi, { CreatePricePlanRequest } from '~/apis/prices.api'
import warehousesApi from '~/apis/warehouses.api'
import DefaultProductImage from '~/components/DefaultProductImage'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { convertToLocaleDateTime } from '~/utils/format'
import FilterWarehouseMany from '../FilterWarehouseMany'
import HistoryDialog from '../HistoryDialog'
import QuickApplyDialog from '../QuickApplyDialog'

export default function CreatePricePlan() {
    useSetTitle('Lên bảng giá')
    const navigate = useNavigate()
    const [globalFilter] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [rowVariants, setRowVariants] = useState<Variant[]>([])
    const [message, setMessage] = useState<string>('')
    const [salePrice, setSalePrice] = useState<{ [key: number]: number }>({})
    const [promotionPrice, setPromotionPrice] = useState<{ [key: number]: number }>({})
    const [startDate, setStartDate] = useState<{ [key: number]: string }>({})
    const [endDate, setEndDate] = useState<{ [key: number]: string }>({})
    const { register, handleSubmit } = useForm()
    const [quickApplyVisible, setQuickApplyVisible] = useState(false)
    const [quickApplyStartDate, setQuickApplyStartDate] = useState<Nullable<Date>>(null)
    const [quickApplyEndDate, setQuickApplyEndDate] = useState<Nullable<Date>>(null)
    const [quickApplyPercentage, setQuickApplyPercentage] = useState<number | ''>(0)
    const [quickApplyPercentagePromotion, setQuickApplyPercentagePromotion] = useState<number | ''>(0)
    const [openHistory, setOpenHistory] = useState<boolean>(false)
    const [warehouseId, setWarehouseId] = useState<number>(0)

    const createPricePlanMutation = useMutation({
        mutationFn: (body: CreatePricePlanRequest) => pricesApi.createPricePlan(body)
    })

    const onSubmit = handleSubmit(() => {
        setMessage('')
        const rowVariant = rowVariants.map((row) => {
            return {
                variant_id: row.id as number,
                sale_price: salePrice[row.id] as number,
                promotion_price: promotionPrice[row.id] as number,
                start_date:
                    startDate[row.id] && startDate[row.id].length >= 0
                        ? convertToLocaleDateTime(startDate[row.id] as string)
                        : null,
                end_date:
                    endDate[row.id] && endDate[row.id].length >= 0 ? convertToLocaleDateTime(endDate[row.id] as string) : null
            }
        })
        const body: CreatePricePlanRequest = {
            price_plans: rowVariant
        }

        createPricePlanMutation.mutate(body, {
            onSuccess: () => {
                toast.success(MESSAGE.CREATE_PRICE_PLAN_SUCCESS)
                navigate(PATH.PRICE_PLAN_LIST)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })

    // Render

    const handleSalePriceChange = (id: number, value: number) => {
        setSalePrice((prev) => ({ ...prev, [id]: value }))
    }

    const handlePromotionPriceChange = (id: number, value: number) => {
        setPromotionPrice((prev) => ({ ...prev, [id]: value }))
    }

    const handleStartDateChange = (id: number, value: Nullable<Date>) => {
        setStartDate((prev) => ({ ...prev, [id]: value?.toString() || '' }))
    }

    const handleEndDateChange = (id: number, value: Nullable<Date>) => {
        setEndDate((prev) => ({ ...prev, [id]: value?.toString() || '' }))
    }

    const applyQuickUpdate = () => {
        const newSalePrices = rowVariants.reduce((acc: { [key: number]: number }, variant) => {
            acc[variant.id] =
                variant.warehouse.purchase_price +
                variant.warehouse.purchase_price * Number((quickApplyPercentage as number) / 100)
            return acc
        }, {})

        const newPromotionPrices = rowVariants.reduce((acc: { [key: number]: number }, variant) => {
            acc[variant.id] =
                variant.warehouse.purchase_price +
                variant.warehouse.purchase_price * Number((quickApplyPercentagePromotion as number) / 100)
            return acc
        }, {})

        const newStartDates = rowVariants.reduce((acc: { [key: number]: string }, variant) => {
            acc[variant.id] = quickApplyStartDate?.toString() || ''
            return acc
        }, {})

        const newEndDates = rowVariants.reduce((acc: { [key: number]: string }, variant) => {
            acc[variant.id] = quickApplyEndDate?.toString() || ''
            return acc
        }, {})

        setSalePrice(quickApplyPercentage ? newSalePrices : {})
        setPromotionPrice(quickApplyPercentagePromotion ? newPromotionPrices : {})
        setStartDate(newStartDates)
        setEndDate(newEndDates)
        setQuickApplyVisible(false)
    }

    const variantImageTemplate = useCallback(
        () => (
            <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                <DefaultProductImage height='28px' />
            </div>
        ),
        []
    )
    const variantNameTemplate = useCallback((rowData: Variant) => {
        return (
            <div
                onClick={() => handleOpenHistory(rowData.warehouse.id)}
                className='font-normal text-gray-800 flex flex-col gap-1 cursor-pointer'
            >
                <p
                    className='text-[13.6px]'
                    style={{
                        maxWidth: '230px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {rowData.variant_name}
                </p>
                <p className='text-[13.6px] text-blue-500'>{rowData.sku}</p>
            </div>
        )
    }, [])

    const variantPurchasePriceTemplate = useCallback((rowData: Variant) => rowData.warehouse.purchase_price, [])

    const variantSalePriceTemplate = useCallback(
        (rowData: Variant) => {
            return (
                <MyInput
                    register={register}
                    className='w-28 h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                    name={`sale_price_${rowData.id}`}
                    style={{ fontSize: '13.6px' }}
                    value={salePrice[rowData.id] || 0}
                    onChange={(e) => handleSalePriceChange(rowData.id, parseInt(e.target.value))}
                />
            )
        },
        [register, salePrice]
    )
    const variantPromtionPriceTemplate = useCallback(
        (rowData: Variant) => {
            return (
                <MyInput
                    register={register}
                    className='w-28 h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                    name={`promotion_price_${rowData.id}`}
                    style={{ fontSize: '13.6px' }}
                    value={promotionPrice[rowData.id] || 0}
                    onChange={(e) => handlePromotionPriceChange(rowData.id, parseInt(e.target.value))}
                />
            )
        },
        [promotionPrice, register]
    )

    const variantStartDateTemplate = useCallback(
        (rowData: Variant) => {
            const startDateValue = startDate[rowData.id] ? new Date(startDate[rowData.id]) : null
            return (
                <Calendar
                    placeholder='mm/dd/yyyy'
                    name={`start_date_${rowData.id}`}
                    value={startDateValue}
                    className='h-[40px] date-price-plan'
                    onChange={(e) => handleStartDateChange(rowData.id, e.value)}
                />
            )
        },
        [startDate]
    )
    const variantEndDateTemplate = useCallback(
        (rowData: Variant) => {
            const endDateValue = endDate[rowData.id] ? new Date(endDate[rowData.id]) : null
            return (
                <Calendar
                    placeholder='mm/dd/yyyy'
                    name={`end_date_${rowData.id}`}
                    value={endDateValue}
                    className='h-[40px] date-price-plan'
                    onChange={(e) => handleEndDateChange(rowData.id, e.value)}
                />
            )
        },
        [endDate]
    )

    const variantActionTemplate = useCallback(
        (rowData: Variant) => (
            <div className='flex items-center'>
                <MyButton type='button' text severity='danger' onClick={() => handleRemoveRowVariant(rowData.id)}>
                    <LiaTimesSolid fontSize='20px' />
                </MyButton>
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleRemoveRowVariant = useCallback((rowId: number) => {
        setRowVariants((prev) => prev.filter((row) => row.id !== rowId))
    }, [])

    const header = useMemo(
        () => (
            <FilterWarehouseMany
                rowVariants={rowVariants}
                setRowVariants={setRowVariants}
                search={search}
                setSearch={setSearch}
                onQuickApply={() => setQuickApplyVisible(true)}
            />
        ),
        [rowVariants, search]
    )

    const handleOpenHistory = (id: number) => {
        setOpenHistory(true)
        setWarehouseId(id)
    }

    const { data: warehouse } = useQuery({
        queryKey: ['warehouse', warehouseId],
        queryFn: () => warehousesApi.getWarehouseById(warehouseId),
        enabled: openHistory
    })

    return (
        <div className=''>
            <form onSubmit={onSubmit}>
                {message && <ShowMessage severity='warn' detail={message} />}
                <div className='card w-full'>
                    <div className='mt-6'>
                        <div className='bg-white px-5 py-5'>
                            <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin sản phẩm</h3>
                            <div className='my-4'></div>
                            <DataTable
                                value={(rowVariants as unknown as DataTableValueArray) ?? []}
                                dataKey='id'
                                header={header}
                                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                                className='shadow'
                                globalFilter={globalFilter}
                            >
                                <Column body={variantImageTemplate} header='Ảnh' />
                                <Column className='w-[20%]' body={variantNameTemplate} header='Tên sản phẩm' />
                                <Column body={variantPurchasePriceTemplate} header='Giá nhập' />
                                <Column body={variantSalePriceTemplate} header='Giá bán ra' />
                                <Column body={variantPromtionPriceTemplate} header='Giá khuyến mãi' />
                                <Column className='w-[12%]' body={variantStartDateTemplate} header='Ngày bắt đầu' />
                                <Column className='w-[12%]' body={variantEndDateTemplate} header='Ngày kết thúc' />
                                <Column body={variantActionTemplate} className='w-[5%]' />
                            </DataTable>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-4 pb-14 pt-6'>
                    <Link to={PATH.PRICE_PLAN_LIST}>
                        <MyButton type='button' className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>

                    <MyButton className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu giá bán</p>
                    </MyButton>
                </div>
            </form>

            {/* Apply Quickly */}
            <QuickApplyDialog
                visible={quickApplyVisible}
                onHide={() => setQuickApplyVisible(false)}
                onApply={applyQuickUpdate}
                setQuickApplyStartDate={setQuickApplyStartDate}
                setQuickApplyEndDate={setQuickApplyEndDate}
                setQuickApplyPercentage={setQuickApplyPercentage}
                setQuickApplyPercentagePromotion={setQuickApplyPercentagePromotion}
                quickApplyStartDate={quickApplyStartDate}
                quickApplyEndDate={quickApplyEndDate}
                quickApplyPercentage={quickApplyPercentage}
                quickApplyPercentagePromotion={quickApplyPercentagePromotion}
            />

            <HistoryDialog warehouse={warehouse} visible={openHistory} onHide={() => setOpenHistory(false)} />
        </div>
    )
}
