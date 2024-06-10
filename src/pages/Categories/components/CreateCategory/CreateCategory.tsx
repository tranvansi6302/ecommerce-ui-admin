import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import categoriesApi from '~/apis/categories.api'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import { queryClient } from '~/main'
import { CategorySchemaType, categorySchema } from '~/schemas/category.schema'

interface CreateCategoryProps {
    setOpen: (open: boolean) => void
}

type CreateCategoryForm = CategorySchemaType

export default function CreateCategory({ setOpen }: CreateCategoryProps) {
    console.log('CreateCategory')

    const [message, setMessage] = useState<string>('')
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateCategoryForm>({
        resolver: yupResolver(categorySchema)
    })

    const createCategoryMutation = useMutation({
        mutationFn: (data: { name: string }) => categoriesApi.createCategory(data)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        createCategoryMutation.mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['categories']
                })
                setOpen(false)
                toast.success(MESSAGE.CREATE_CATEGORY_SUCCESS)
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
                placeholder='Nhập tên loại sản phẩm'
                label='Tên loại sản phẩm'
                className='w-full py-0 font-normal h-[40px] flex items-center'
                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                styleMessage={{ fontSize: '13.6px' }}
            />
            <div className='flex justify-end gap-4'>
                <MyButton onClick={() => setOpen(false)} className='rounded-[3px] h-9' outlined>
                    <p className='font-semibold text-[14px]'>Thoát</p>
                </MyButton>

                <MyButton loading={createCategoryMutation.isPending} className='rounded-[3px] h-9 w-36'>
                    <p className='font-semibold text-[14px]'>Lưu loại sản phẩm</p>
                </MyButton>
            </div>
        </form>
    )
}
