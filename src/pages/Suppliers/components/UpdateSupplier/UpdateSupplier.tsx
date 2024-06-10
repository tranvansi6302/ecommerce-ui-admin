import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoChevronBackOutline } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { SupplierStatus } from '~/@types/supplier'
import { MessageResponse } from '~/@types/util'
import suppliersApi, { UpdateSupplierRequest } from '~/apis/supplier.api'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInput from '~/components/MyInput'
import MyTextarea from '~/components/MyTextarea'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import { supplierSchema } from '~/schemas/supplier.schema'

const supplierStatus: SupplierStatus[] = [
    { id: 'ACTIVE', status: 'Đang giao dịch' },
    { id: 'INACTIVE', status: 'Ngừng giao dịch' }
]

type UpdateSupplierForm = UpdateSupplierRequest

export default function UpdateSupplier() {
    const { id: supplierId } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [message, setMessage] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<SupplierStatus>()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateSupplierForm>({
        resolver: yupResolver(supplierSchema)
    })

    const { data: supplier } = useQuery({
        queryKey: ['supplier', supplierId],
        queryFn: () => suppliersApi.getSupplierById(Number(supplierId)),
        enabled: !!supplierId
    })

    console.log(selectedStatus)

    useEffect(() => {
        if (supplier) {
            setValue('name', supplier.data.result.name)
            setValue('email', supplier.data.result.email)
            setValue('tax_code', supplier.data.result.tax_code)
            setValue('phone_number', supplier.data.result.phone_number)
            setValue('address', supplier.data.result.address)
            if (supplier.data.result.status === 'ACTIVE') {
                setSelectedStatus(supplierStatus[0])
            } else {
                setSelectedStatus(supplierStatus[1])
            }
        }
    }, [setValue, supplier])

    const updateSupplierMutation = useMutation({
        mutationFn: (payload: { id: number; body: UpdateSupplierForm }) => suppliersApi.updateSupplier(payload.id, payload.body)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        const payload = {
            id: Number(supplierId),
            body: {
                ...data,
                status: selectedStatus?.id || ''
            }
        }
        console.log(payload)
        updateSupplierMutation.mutate(payload, {
            onSuccess: () => {
                toast.success(MESSAGE.UPDATE_SUPPLIER_SUCCESS)
                navigate(PATH.SUPPLIER_LIST)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })

    return (
        <div className='card w-full py-4 px-10 '>
            <Link to={PATH.SUPPLIER_LIST} className='flex items-center gap-2 mb-2 text-[14px] text-gray-600'>
                <IoChevronBackOutline />
                <p>Danh sách nhà cung cấp</p>
            </Link>
            <h2 className='text-[24px] font-semibold text-gray-900 mb-8'>Cập nhật nhà cung cấp</h2>
            <form onSubmit={onSubmit}>
                <div className='bg-white p-5'>
                    {message && <ShowMessage detail={message} />}
                    <div className='grid grid-cols-2 gap-5'>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='name'
                                placeholder='Tên nhà cung cấp'
                                label='Nhập tên nhà cung cấp'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='email'
                                placeholder='Nhập địa chỉ email'
                                label='Địa chỉ email'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='tax_code'
                                placeholder='Nhập mã số thuế'
                                label='Mã số thuế'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='phone_number'
                                placeholder='Nhập số điện thoại'
                                label='Số điện thoại'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div className=''>
                            <div className='mt-3'>
                                <label className='text-[13.6px] text-gray-900' htmlFor='status'>
                                    Trạng thái
                                </label>
                                <MyDropdown
                                    register={register}
                                    errors={errors}
                                    value={selectedStatus}
                                    onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                                    options={supplierStatus}
                                    optionLabel='status'
                                    placeholder='Trạng thái'
                                    name='status'
                                    className='mt-1'
                                />
                            </div>
                        </div>
                        <div className='col-span-2 w-full'>
                            <MyTextarea
                                errors={errors}
                                register={register}
                                name='address'
                                placeholder='Nhập địa chỉ cụ thể'
                                label='Địa chỉ cụ thể'
                                className='w-full py-0 font-normal  flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-4 py-14'>
                    <Link to={PATH.SUPPLIER_LIST}>
                        <MyButton className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>
                    <MyButton loading={false} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu nhà cung cấp</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
