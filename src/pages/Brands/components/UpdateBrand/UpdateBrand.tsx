import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
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

interface UpdateBrandProps {
    setOpen: (open: boolean) => void
    brandId: number
}

type UpdateBrandForm = BrandSchemaType

export default function UpdateBrand({ setOpen, brandId }: UpdateBrandProps) {
    const [message, setMessage] = useState<string>('')
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateBrandForm>({
        resolver: yupResolver(brandSchema)
    })

    const { data: brand } = useQuery({
        queryKey: ['brand', brandId],
        queryFn: () => brandsApi.getBrandById(brandId),
        enabled: !!brandId
    })
    useEffect(() => {
        if (brand) {
            setValue('name', brand.data.result.name)
        }
    }, [brand, setValue])

    const updateBrandMutation = useMutation({
        mutationFn: (payload: { id: number; body: UpdateBrandForm }) => brandsApi.updateBrand(payload.id, payload.body)
    })

    const onSubmit = handleSubmit((data) => {
        setMessage('')
        const payload = {
            id: brandId,
            body: data
        }

        updateBrandMutation.mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['brands']
                })
                setOpen(false)
                toast.success(MESSAGE.UPDATE_BRAND_SUCCESS)
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

                <MyButton loading={updateBrandMutation.isPending} className='rounded-[3px] h-9 w-36'>
                    <p className='font-semibold text-[14px]'>Lưu thương hiệu</p>
                </MyButton>
            </div>
        </form>
    )
}
