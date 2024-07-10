import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Dialog } from 'primereact/dialog'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MessageResponse } from '~/@types/util'
import { Variant } from '~/@types/variant'
import variantsApi from '~/apis/variants.api'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import { queryClient } from '~/main'
import { variantSchema, VariantSchemaType } from '~/schemas/variant.schema'

interface UpdateVariantProps {
    variant: Variant
    openVariant: boolean
    setOpenVariant: (open: boolean) => void
}

type FormUpdateVariant = VariantSchemaType
export default function UpdateVariant({ variant, openVariant, setOpenVariant }: UpdateVariantProps) {
    const [errorMessageVariant, setErrorMessageVariant] = useState<string>('')
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormUpdateVariant>({
        resolver: yupResolver(variantSchema)
    })

    useEffect(() => {
        setValue('variant_name', variant?.variant_name)
        setValue('sku', variant?.sku)
        setValue('color', variant?.color)
        setValue('size', variant?.size)
    }, [setValue, variant])

    const updateVariantMutation = useMutation({
        mutationFn: (payload: { id: number; body: FormUpdateVariant }) => variantsApi.updateVariant(payload.id, payload.body)
    })

    const onSubmit = handleSubmit((data) => {
        setErrorMessageVariant('')
        const payload = {
            id: variant.id,
            body: data
        }
        updateVariantMutation.mutate(payload, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: ['product']
                })
                toast.success(data.data.message)
                setOpenVariant(false)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setErrorMessageVariant(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })
    return (
        <Dialog
            header={<p className='font-medium'>Cập nhật phiên bản</p>}
            visible={openVariant}
            style={{ width: '40vw' }}
            onHide={() => {
                reset()
                setOpenVariant(false)
            }}
        >
            {errorMessageVariant && <ShowMessage severity='warn' detail={errorMessageVariant} />}
            <form onSubmit={onSubmit} className='p-fluid'>
                <div className='field mt-4'>
                    <MyInput
                        register={register}
                        errors={errors}
                        name='variant_name'
                        label='Tên phiên bản'
                        placeholder='Nhập tên phiên bản'
                        className='w-full h-[40px] rounded-none'
                        classNameLabel='text-[13.6px]'
                        style={{ fontSize: '13.6px' }}
                        styleMessage={{ fontSize: '13px' }}
                    />
                </div>
                <div className='field mt-4'>
                    <MyInput
                        register={register}
                        errors={errors}
                        name='sku'
                        label='SKU'
                        placeholder='Nhập mã SKU'
                        className='w-full h-[40px] rounded-none'
                        classNameLabel='text-[13.6px]'
                        style={{ fontSize: '13.6px' }}
                        styleMessage={{ fontSize: '13px' }}
                    />
                </div>
                <div className='field mt-4'>
                    <MyInput
                        register={register}
                        errors={errors}
                        name='color'
                        label='Màu sắc'
                        placeholder='Nhập màu sắc'
                        className='w-full h-[40px] rounded-none'
                        classNameLabel='text-[13.6px]'
                        style={{ fontSize: '13.6px' }}
                        styleMessage={{ fontSize: '13px' }}
                    />
                </div>
                <div className='field mt-4'>
                    <MyInput
                        register={register}
                        errors={errors}
                        name='size'
                        label='Kích thước'
                        placeholder='Nhập kích thước'
                        className='w-full h-[40px] rounded-none'
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
                            setOpenVariant(false)
                            reset()
                        }}
                    >
                        <p className='font-semibold text-[14px]'>Thoát</p>
                    </MyButton>

                    <MyButton type='submit' className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Xác nhận</p>
                    </MyButton>
                </div>
            </form>
        </Dialog>
    )
}
