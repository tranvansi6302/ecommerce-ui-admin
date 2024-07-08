import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ChipsChangeEvent } from 'primereact/chips'
import { Divider } from 'primereact/divider'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { MessageResponse } from '~/@types/util'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import productsApi, { CreateProductRequest } from '~/apis/products.api'
import MyButton from '~/components/MyButton'
import MyChip from '~/components/MyChip'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import Upload from '~/components/Upload'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { productSchema } from '~/schemas/products.schema'

type FormDataCreateProduct = Pick<CreateProductRequest, 'name' | 'sku' | 'brand_id' | 'category_id'>
const createProductSchema = productSchema

export default function CreateProduct() {
    useSetTitle('Tạo sản phẩm')
    const navigate = useNavigate()
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [description, setDescription] = useState<string>('')
    const [openEditor, setOpenEditor] = useState<boolean>(false)
    const [openVariant, setOpenVariant] = useState<boolean>(false)
    const [sizes, setSizes] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [message, setMessage] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])

    // Handle form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormDataCreateProduct>({
        resolver: yupResolver(createProductSchema)
    })

    const createProductMutation = useMutation({
        mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data)
    })

    const uploadImagesMutation = useMutation({
        mutationFn: (payload: { id: number; body: FormData }) => productsApi.uploadImages(payload.id, payload.body)
    })

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands({ status: 'ACTIVE' })
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories({ status: 'ACTIVE' })
    })

    // Submit form
    const onsubmit = handleSubmit(async (data) => {
        setMessage('')
        const finalData: CreateProductRequest = {
            ...data,
            description,
            colors,
            sizes,
            brand_id: selectedBrand?.id.toString() ?? '',
            category_id: selectedCategory?.id.toString() ?? ''
        }

        const product = await createProductMutation.mutateAsync(finalData, {
            onSuccess: () => {
                if (files.length === 0) {
                    toast.success(MESSAGE.CREATE_PRODUCT_SUCCESS)
                    navigate(PATH.PRODUCT_LIST)
                }
            },
            onError: (error) => {
                console.log(error)
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })

        if (files && files.length > 0) {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('files', file)
            })

            const payload = {
                id: product.data.result.id,
                body: formData
            }
            await uploadImagesMutation.mutateAsync(payload, {
                onSuccess: () => {
                    toast.success(MESSAGE.CREATE_PRODUCT_SUCCESS)
                    navigate(PATH.PRODUCT_LIST)
                },
                onError: (error) => {
                    console.log(error)
                    const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                    setMessage(errorResponse?.message ?? '')
                    toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
                }
            })
        }
    })

    const handleOnSelectedFiles = (files: File[]) => {
        setFiles(files)
    }

    return (
        <div className='card w-full'>
            {message && <ShowMessage severity='warn' detail={message} />}
            <form onSubmit={onsubmit} className=''>
                <div className='flex items-start gap-6'>
                    <div className='w-[60%]'>
                        <div className='bg-white px-5 py-5'>
                            <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin chung</h3>
                            <Divider />
                            <MyInput
                                register={register}
                                errors={errors}
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                label='Tên sản phẩm'
                                name='name'
                                placeholder='Nhập tên sản phẩm'
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                            <MyInput
                                register={register}
                                errors={errors}
                                className='w-1/2 py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1 mt-3'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                label='Mã SKU'
                                name='sku'
                                placeholder='Nhập mã SKU'
                                styleMessage={{ fontSize: '13.6px' }}
                            />

                            <div className='mt-3'>
                                <p
                                    onClick={() => setOpenEditor(!openEditor)}
                                    className='text-[13.6px] text-blue-600 cursor-pointer'
                                >
                                    Chi tiết sản phẩm
                                </p>
                                {openEditor && (
                                    <Editor
                                        value={description}
                                        className='mt-1'
                                        onTextChange={(e: EditorTextChangeEvent) => setDescription(e.htmlValue || '')}
                                        style={{ height: '200px' }}
                                        id='description'
                                    />
                                )}
                            </div>
                        </div>

                        <div className='bg-white px-5 py-5 mt-5'>
                            <div className='cursor-pointer' onClick={() => setOpenVariant(!openVariant)}>
                                <h3 className='text-base font-medium text-blue-600 pt-3'>Thuộc tính</h3>
                                <p className='text-sm mt-2'>
                                    Thêm mới các thuộc tính giúp sản phẩm có nhiều sự lựa chọn hơn như kích thước, màu sắc
                                </p>
                            </div>

                            {openVariant && (
                                <div className=''>
                                    <Divider />
                                    <div className=''>
                                        <MyChip
                                            label='Kích thước'
                                            value={sizes}
                                            onChange={(e: ChipsChangeEvent) => setSizes(e.value ?? [])}
                                            id='sizes'
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <MyChip
                                            label='Màu sắc'
                                            value={colors}
                                            onChange={(e: ChipsChangeEvent) => setColors(e.value ?? [])}
                                            id='colors'
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-[40%] bg-white px-5 py-5'>
                        <h3 className='text-base font-medium text-gray-900 pt-3'>Thông tin bổ sung</h3>
                        <Divider />
                        <div className=''>
                            <label className='text-[13.6px] text-gray-900' htmlFor='brand_id'>
                                Thương hiệu
                            </label>
                            <MyDropdown
                                register={register}
                                errors={errors}
                                value={selectedBrand}
                                onChange={(e: DropdownChangeEvent) => setSelectedBrand(e.value)}
                                options={brands?.data.result}
                                optionLabel='name'
                                placeholder='Chọn thương hiệu'
                                name='brand_id'
                                className='mt-1'
                            />
                        </div>
                        <div className='mt-3'>
                            <label className='text-[13.6px] text-gray-900' htmlFor='category_id'>
                                Loại sản phẩm
                            </label>
                            <MyDropdown
                                register={register}
                                errors={errors}
                                value={selectedCategory}
                                onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)}
                                options={categories?.data.result}
                                optionLabel='name'
                                placeholder='Chọn loại sản phẩm'
                                name='category_id'
                                className='mt-1'
                            />
                        </div>
                        <div className='mt-3'>
                            <p className='text-[13.6px] text-gray-900'>Hình ảnh</p>
                            <div className='mt-1'>
                                <Upload onSelectedFiles={handleOnSelectedFiles} id='upload-product' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-4 py-14'>
                    <Link to={PATH.PRODUCT_LIST}>
                        <MyButton className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>
                    <MyButton loading={uploadImagesMutation.isPending} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu sản phẩm</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
