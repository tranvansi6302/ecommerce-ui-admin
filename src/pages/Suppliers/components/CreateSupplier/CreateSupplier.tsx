import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoChevronBackOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import suppliersApi, { CreateSupplierRequest } from '~/apis/supplier.api'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import MyTextarea from '~/components/MyTextarea'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { queryClient } from '~/main'
import { supplierSchema } from '~/schemas/supplier.schema'

type CreateSupplierForm = CreateSupplierRequest

export default function CreateSupplier() {
    useSetTitle('Thêm mới nhà cung cấp')
    const [message, setMessage] = useState<string>('')
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateSupplierForm>({
        resolver: yupResolver(supplierSchema.omit(['status']))
    })

    const createSupplierMutation = useMutation({
        mutationFn: (data: CreateSupplierForm) => suppliersApi.createSupplier(data)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        createSupplierMutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['suppliers']
                })
                toast.success(MESSAGE.CREATE_SUPPLIER_SUCCESS)
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
            <h2 className='text-[24px] font-semibold text-gray-900 mb-8'>Thêm mới nhà cung cấp</h2>
            <form onSubmit={onSubmit}>
                <div className='bg-white p-5'>
                    {message && <ShowMessage severity='warn' detail={message} />}
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
                        <div className='col-span-2 w-full'>
                            <MyTextarea
                                {...register('address')}
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
                        <MyButton type='button' className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>
                    <MyButton type='submit' loading={createSupplierMutation.isPending} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu nhà cung cấp</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
