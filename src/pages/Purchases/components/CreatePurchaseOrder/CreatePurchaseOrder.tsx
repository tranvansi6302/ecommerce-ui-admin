import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Column } from 'primereact/column'
import { DataTable, DataTableValueArray } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Divider } from 'primereact/divider'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEdit } from 'react-icons/fa'
import { FaRegCircleUser } from 'react-icons/fa6'
import { GoCodeSquare } from 'react-icons/go'
import { LiaTimesSolid } from 'react-icons/lia'
import { MdMyLocation, MdOutlineMailOutline, MdOutlinePhoneForwarded } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Supplier } from '~/@types/supplier'
import { MessageResponse } from '~/@types/util'
import { Variant } from '~/@types/variant'
import purchasesApi, { CreatePurchaseOrderRequest } from '~/apis/purchases.api'
import suppliersApi from '~/apis/supplier.api'
import noInfoImage from '~/assets/images/no-info.jpg'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInput from '~/components/MyInput'
import MyTextarea from '~/components/MyTextarea'
import SetProductImage from '~/components/SetProductImage'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { PurchaseDetailSchemaType, createPurchaseSchema } from '~/schemas/purchase.schema'
import { formatCurrencyVND } from '~/utils/format'
import FilterProductMany from '../FilterProductMany'
import SupplierInfo from '../SupplierInfo'

type CreatePurchaseOrderForm = CreatePurchaseOrderRequest & { [key: string]: any }
export default function CreatePurchaseOrder() {
    useSetTitle('Tạo đơn hàng nhập')
    const navigate = useNavigate()
    const [globalFilter] = useState<string>('')
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier>()
    const [search, setSearch] = useState<string>('')
    const [rowVariants, setRowVariants] = useState<Variant[]>([])
    const [message, setMessage] = useState<string>('')
    const [quantity, setQuantity] = useState<{ [key: number]: number }>({})
    const [purchasePrice, setPurchasePrice] = useState<{ [key: number]: number }>({})
    const [openNote, setOpenNote] = useState<boolean>(false)
    const [noteVariant, setNoteVariant] = useState<{ [key: number | string]: string | string }>({})
    const [noteRowId, setNoteRowId] = useState<number>(0)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreatePurchaseOrderForm>({
        resolver: yupResolver(createPurchaseSchema)
    })
    const { data: suppliers } = useQuery({
        queryKey: ['suppliers'],
        queryFn: () => suppliersApi.getAllSuppliers(),
        placeholderData: keepPreviousData
    })

    const createPurchaseOrderMutation = useMutation({
        mutationFn: (body: CreatePurchaseOrderForm) => purchasesApi.createPurchase(body)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        const rowVariant: PurchaseDetailSchemaType[] = rowVariants.map((row) => {
            return {
                variant_id: row.id.toString(),
                quantity: data['quantity' + '_' + row.id] as number,
                purchase_price: data['purchase_price' + '_' + row.id] as number,
                note: noteVariant[row.id]
            }
        })
        const body: CreatePurchaseOrderForm = {
            supplier_id: selectedSupplier?.id.toString() ?? '',
            purchase_order_code: data.purchase_order_code,
            note: data.note,
            purchase_details: rowVariant
        }
        createPurchaseOrderMutation.mutate(body, {
            onSuccess: () => {
                toast.success(MESSAGE.CREATE_PURCHASE_SUCCESS)
                navigate(PATH.PURCHASE_LIST)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
        console.log(body)
    })

    // Render

    const handleQuantityChange = (id: number, value: number) => {
        setQuantity((prev) => ({ ...prev, [id]: value }))
    }

    const handlePriceChange = (id: number, value: number) => {
        setPurchasePrice((prev) => ({ ...prev, [id]: value }))
    }

    const variantNumberTemplate = useCallback((_: any, index: any) => index.rowIndex + 1, [])
    const variantImageTemplate = useCallback((rowData: Variant) => <SetProductImage productImages={rowData.product_images} />, [])
    const variantNameTemplate = useCallback((rowData: Variant) => {
        return (
            <div className='font-normal text-gray-800 flex flex-col gap-1'>
                <p className='text-[13.6px] '>{rowData.variant_name}</p>
                <p className='text-[13.6px] text-blue-500'>{rowData.sku}</p>
            </div>
        )
    }, [])
    const variantQuantityTemplate = useCallback(
        (rowData: Variant) => {
            return (
                <MyInput
                    register={register}
                    className='w-28 h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                    name={`quantity_${rowData.id}`}
                    type='number'
                    value={quantity[rowData.id] || 0}
                    onChange={(e) => handleQuantityChange(rowData.id, parseInt(e.target.value))}
                />
            )
        },
        [quantity, register]
    )

    const variantPriceTemplate = useCallback(
        (rowData: Variant) => {
            return (
                <MyInput
                    register={register}
                    className='w-28 h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                    name={`purchase_price_${rowData.id}`}
                    style={{ fontSize: '13.6px' }}
                    value={purchasePrice[rowData.id] || 0}
                    onChange={(e) => handlePriceChange(rowData.id, parseInt(e.target.value))}
                />
            )
        },
        [register, purchasePrice]
    )

    const variantTotalPriceTemplate = useCallback(
        (rowData: Variant) => {
            const quantityRow = quantity[rowData.id] || 0
            const purchasePriceRow = purchasePrice[rowData.id] || 0
            return quantityRow * purchasePriceRow
        },
        [quantity, purchasePrice]
    )

    const variantActionTemplate = useCallback(
        (rowData: Variant) => (
            <div className='flex items-center'>
                <MyButton type='button' text severity='danger' onClick={() => handleRemoveRowVariant(rowData.id)}>
                    <LiaTimesSolid fontSize='20px' />
                </MyButton>
                <MyButton
                    type='button'
                    text
                    severity='success'
                    className='w-10 mb-[2px]'
                    onClick={() => handleNoteVariant(rowData.id)}
                >
                    <p>
                        <FaRegEdit fontSize='20px' />
                    </p>
                </MyButton>
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleRemoveRowVariant = useCallback((rowId: number) => {
        setRowVariants((prev) => prev.filter((row) => row.id !== rowId))
    }, [])

    const handleNoteChange = (id: number, value: string) => {
        setNoteVariant((prev) => ({ ...prev, [id]: value }))
    }

    const handleNoteVariant = (rowId: number) => {
        setOpenNote(true)
        setNoteRowId(rowId)
    }

    const handleConfirmNote = () => {
        console.log(noteVariant)
        setOpenNote(false)
    }

    const header = useMemo(
        () => (
            <FilterProductMany rowVariants={rowVariants} setRowVariants={setRowVariants} search={search} setSearch={setSearch} />
        ),
        [rowVariants, search]
    )

    // Total
    const quantityTotal = useCallback(() => {
        return rowVariants.reduce((total, row) => total + (quantity[row.id] || 0), 0)
    }, [quantity, rowVariants])

    const totalPrice = useCallback(() => {
        return rowVariants.reduce((total, row) => total + (quantity[row.id] || 0) * (purchasePrice[row.id] || 0), 0)
    }, [purchasePrice, quantity, rowVariants])

    return (
        <div className=''>
            {/* Note */}
            <Dialog
                header={<p className='font-medium text-gray-900'>Ghi chú</p>}
                visible={openNote}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!openNote) return
                    setNoteRowId(0)
                    setOpenNote(false)
                }}
            >
                <div className='m-0'>
                    <div>
                        <MyTextarea
                            register={register}
                            placeholder='Nhập ghi chú'
                            className='w-full py-0 font-normal flex items-center'
                            classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                            value={noteVariant[noteRowId]}
                            onChange={(e) => handleNoteChange(noteRowId, e.target.value)}
                            name={`note_${noteRowId}`}
                        />
                        <div className='flex justify-end gap-4  pt-6'>
                            <MyButton onClick={() => setOpenNote(false)} className='rounded-[3px] h-9' outlined>
                                <p className='font-semibold text-[14px]'>Thoát</p>
                            </MyButton>

                            <MyButton onClick={handleConfirmNote} className='rounded-[3px] h-9 w-36'>
                                <p className='font-semibold text-[14px]'>Xác nhận</p>
                            </MyButton>
                        </div>
                    </div>
                </div>
            </Dialog>
            <form onSubmit={onSubmit}>
                {message && <ShowMessage severity='warn' detail={message} />}

                <div className='card w-full'>
                    <div className='flex gap-6'>
                        <div className='w-[60%]'>
                            <div className='bg-white px-5 py-5'>
                                <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin nhà cung cấp</h3>
                                <Divider />
                                <MyDropdown
                                    register={register}
                                    errors={errors}
                                    value={selectedSupplier}
                                    onChange={(e: DropdownChangeEvent) => setSelectedSupplier(e.value)}
                                    options={suppliers?.data.result}
                                    optionLabel='name'
                                    placeholder='Chọn nhà cung cấp'
                                    name='supplier_id'
                                    className='mt-1'
                                />
                                <div className='card border border-dashed rounded-sm p-5 h-[193.6px]'>
                                    {selectedSupplier ? (
                                        <div className='card-body text-gray-700  flex flex-col gap-2 '>
                                            <SupplierInfo
                                                title='Tên nhà cung cấp'
                                                icon={<FaRegCircleUser />}
                                                value={selectedSupplier.name ?? ''}
                                            />
                                            <SupplierInfo
                                                title='Mã nhà cung cấp'
                                                icon={<GoCodeSquare />}
                                                value={selectedSupplier.tax_code ?? ''}
                                            />
                                            <SupplierInfo
                                                title='Email'
                                                icon={<MdOutlineMailOutline />}
                                                value={selectedSupplier.email ?? ''}
                                            />
                                            <SupplierInfo
                                                title='Số điện thoại'
                                                icon={<MdOutlinePhoneForwarded />}
                                                value={selectedSupplier.phone_number ?? ''}
                                            />
                                            <SupplierInfo
                                                title='Địa chỉ'
                                                icon={<MdMyLocation />}
                                                value={selectedSupplier.address ?? ''}
                                            />
                                        </div>
                                    ) : (
                                        <div className='flex flex-col gap-3 justify-center items-center h-full text-gray-500'>
                                            <img src={noInfoImage} alt='no-info' width={100} />
                                            <p className='text-blue-500 text-[15px]'>Chưa có thông tin</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='w-[40%]'>
                            <div className='bg-white px-5 py-5 h-full'>
                                <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin đơn nhập hàng</h3>
                                <Divider />
                                <MyInput
                                    register={register}
                                    errors={errors}
                                    className='w-full py-0 font-normal h-[40px] flex items-center'
                                    classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1 mt-3'
                                    style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                    label='Mã đơn hàng'
                                    name='purchase_order_code'
                                    placeholder='Nhập mã đơn hàng'
                                    styleMessage={{ fontSize: '13.6px' }}
                                />
                                <MyTextarea
                                    register={register}
                                    errors={errors}
                                    className='w-full py-0 font-normal  flex items-center'
                                    classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1 mt-3'
                                    style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                    label='Ghi chú'
                                    name='note'
                                    placeholder='Nhập ghi chú'
                                    styleMessage={{ fontSize: '13.6px' }}
                                />
                            </div>
                        </div>
                    </div>

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
                                <Column body={variantNumberTemplate} header='STT' />
                                <Column body={variantImageTemplate} header='Ảnh' />
                                <Column body={variantNameTemplate} header='Tên sản phẩm' />
                                <Column body={variantQuantityTemplate} header='Số lượng' />
                                <Column body={variantPriceTemplate} header='Giá nhập' />
                                <Column body={variantTotalPriceTemplate} header='Thành tiền' />
                                <Column body={variantActionTemplate} className='w-[5%]' />
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div className='mt-10 px-16 flex flex-col items-end gap-2 justify-end'>
                    <div className='flex items-center justify-between w-[255px] text-[13.6px] text-gray-800'>
                        <span>Số lượng</span>
                        <span>{quantityTotal() || 0}</span>
                    </div>
                    <div className='flex items-center justify-between w-[255px] text-[13.6px] text-gray-800'>
                        <span>Tổng tiền</span>
                        <span>{formatCurrencyVND(totalPrice()) || formatCurrencyVND(0)}</span>
                    </div>
                    <div className='flex items-center justify-between w-[255px] text-[13.6px] text-blue-500'>
                        <span>Chiết khấu</span>
                        <span>0</span>
                    </div>
                    <div className='flex items-center font-medium justify-between w-[255px] text-[13.6px] text-gray-800'>
                        <span>Tiền cần trả</span>
                        <span>{formatCurrencyVND(totalPrice()) || formatCurrencyVND(0)}</span>
                    </div>
                </div>
                <Divider />
                <div className='flex justify-end gap-4 pb-14 pt-6'>
                    <Link to={PATH.PURCHASE_LIST}>
                        <MyButton type='button' className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>

                    <MyButton loading={createPurchaseOrderMutation.isPending} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu đơn hàng</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
