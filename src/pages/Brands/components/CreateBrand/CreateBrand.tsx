import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import brandsApi from '~/apis/brands.api'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import { queryClient } from '~/main'
import { BrandSchemaType, brandSchema } from '~/schemas/brand.schema'

interface CreateBrandProps {
    setOpen: (open: boolean) => void
}

type CreateBrandForm = BrandSchemaType

export default function CreateBrand({ setOpen }: CreateBrandProps) {
    console.log('CreateBrand')

    const [message, setMessage] = useState<string>('')
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateBrandForm>({
        resolver: yupResolver(brandSchema)
    })

    const createBrandMutation = useMutation({
        mutationFn: (data: { name: string }) => brandsApi.createBrand(data)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        createBrandMutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['brands']
                })
                setOpen(false)
                toast.success(MESSAGE.CREATE_BRAND_SUCCESS)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })

    return (
        <form onSubmit={onSubmit}>
            {message && <ShowMessage severity='warn' detail={message} />}
            <MyInput
                errors={errors}
                register={register}
                name='name'
                placeholder='Nhập tên thương hiệu'
                label='Tên thương hiệu'
                className='w-full py-0 font-normal h-[40px] flex items-center'
                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                styleMessage={{ fontSize: '13.6px' }}
            />
            <div className='flex justify-end gap-4'>
                <MyButton onClick={() => setOpen(false)} className='rounded-[3px] h-9' outlined>
                    <p className='font-semibold text-[14px]'>Thoát</p>
                </MyButton>

                <MyButton loading={createBrandMutation.isPending} className='rounded-[3px] h-9 w-36'>
                    <p className='font-semibold text-[14px]'>Lưu thương hiệu</p>
                </MyButton>
            </div>
        </form>
    )
}
