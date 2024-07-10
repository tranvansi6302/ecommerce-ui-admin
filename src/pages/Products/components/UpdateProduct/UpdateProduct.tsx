import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Column } from 'primereact/column'
import { DataTable, DataTableSelectionMultipleChangeEvent, DataTableValueArray } from 'primereact/datatable'
import { Divider } from 'primereact/divider'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Editor, EditorTextChangeEvent } from 'primereact/editor'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaAngleDown, FaAngleUp, FaCheckDouble } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Product } from '~/@types/product'
import { MessageResponse } from '~/@types/util'
import { Variant } from '~/@types/variant'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import productsApi, { CreateUpdateProductRequest } from '~/apis/products.api'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import Upload from '~/components/Upload'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { queryClient } from '~/main'
import { productSchema } from '~/schemas/products.schema'
import UpdateVariant from './components/UpdateVariant'
import variantsApi from '~/apis/variants.api'

type FormDataCreateUpdateProduct = Pick<CreateUpdateProductRequest, 'name' | 'sku' | 'brand_id' | 'category_id'>
const createProductSchema = productSchema
const selectedOptions = [{ label: 'Xóa vĩnh viễn', value: 'DELETE' }]

export default function UpdateProduct() {
    useSetTitle('Cập nhật sản phẩm')
    const { id: productId } = useParams<{ id: string }>()
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [description, setDescription] = useState<string>('')
    const [openEditor, setOpenEditor] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [variant, setVariant] = useState<Variant | null>(null)
    const [selectedVariant, setSelectedVariant] = useState<Variant[]>([])
    const [openVariant, setOpenVariant] = useState<boolean>(false)
    const [openUpload, setOpenUpload] = useState<boolean>(false)
    const [globalFilter] = useState<string>('')

    const [files, setFiles] = useState<File[]>([])

    const { data } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => productsApi.getProductById(Number(productId)),
        enabled: !!productId
    })
    const product = data?.data.result as Product

    // Handle form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormDataCreateUpdateProduct>({
        resolver: yupResolver(createProductSchema)
    })

    useEffect(() => {
        setValue('name', product?.name)
        setValue('sku', product?.sku)
        setSelectedBrand(product?.brand)
        setValue('brand_id', product?.brand.id.toString())
        setSelectedCategory(product?.category)
        setValue('category_id', product?.category.id.toString())
        setDescription(product?.description)
    }, [product?.brand, product?.category, product?.description, product?.name, product?.sku, setValue])

    const updateProductMutation = useMutation({
        mutationFn: (payload: { id: number; body: FormDataCreateUpdateProduct }) =>
            productsApi.updateProduct(payload.id, payload.body as CreateUpdateProductRequest)
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
        const finalData = {
            ...data,
            brand_id: selectedBrand?.id.toString() ?? '',
            category_id: selectedCategory?.id.toString() ?? '',
            description
        }
        const payload = {
            id: Number(productId),
            body: finalData
        }
        updateProductMutation.mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['product']
                })
                toast.success(MESSAGE.UPDATE_PRODUCT_SUCCESS)
            },
            onError: (error) => {
                console.log(error)
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })

    const handleOnSelectedFiles = (files: File[]) => {
        setFiles(files)
    }

    const variantNameTemplate = useCallback((rowData: Variant) => {
        return (
            <p
                onClick={() => {
                    setVariant(rowData)
                    setOpenVariant(true)
                }}
                className='text-blue-600 cursor-pointer'
            >
                {rowData.variant_name}
            </p>
        )
    }, [])

    const variantSkuTemplate = useCallback((rowData: Variant) => rowData.sku.toUpperCase(), [])
    const variantColorTemplate = useCallback((rowData: Variant) => rowData.color.toUpperCase(), [])
    const variantSizeTemplate = useCallback((rowData: Variant) => rowData.size.toUpperCase(), [])

    const deleteManyVariantsMutation = useMutation({
        mutationFn: (data: { variant_ids: number[] }) => variantsApi.deleteManyVariants(data),
        onSuccess: (data) => {
            setSelectedVariant([])
            toast.success(data.data.message)
            queryClient.invalidateQueries({
                queryKey: ['product']
            })
        },
        onError: () => {
            toast.error(MESSAGE.NOT_DELETE_CONSTRAINT)
        }
    })

    const handleSelectedOptionChange = (e: DropdownChangeEvent) => {
        switch (e.value) {
            case 'DELETE': {
                const variantIds = selectedVariant.map((variant) => variant.id)
                deleteManyVariantsMutation.mutate({ variant_ids: variantIds })
                break
            }
            default:
                break
        }
    }

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-4 items-center'>
                <span className='text-blue-600 text-[15px] font-normal flex items-center gap-2'>
                    <FaCheckDouble />
                    Đã chọn {selectedVariant.length} dòng trên trang này
                </span>
                <Dropdown
                    style={{ width: '300px' }}
                    options={selectedOptions}
                    onChange={handleSelectedOptionChange}
                    className='rounded-sm border-gray-200 font-normal text-[14px] h-[44px] flex items-center'
                    placeholder='Chọn thao tác'
                />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedVariant.length]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedVariant(e.value as Variant[])
    }, [])

    return (
        <div className='card w-full'>
            <UpdateVariant openVariant={openVariant} setOpenVariant={setOpenVariant} variant={variant as Variant} />
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
                                <h3
                                    onClick={() => setOpenEditor(!openEditor)}
                                    className='text-[13.6px] text-blue-600 cursor-pointer font-medium flex items-center'
                                >
                                    Chi tiết sản phẩm
                                    {openEditor ? (
                                        <FaAngleUp className='inline-block ml-1 text-[16px]' />
                                    ) : (
                                        <FaAngleDown className='inline-block ml-1 text-[16px]' />
                                    )}
                                </h3>
                                <p className='text-sm mt-2'>Mô tả chi tiết hơn về thông tin sản phẩm</p>
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
                            <h3
                                onClick={() => setOpenUpload(!openUpload)}
                                className='text-[13.6px] text-blue-600 font-medium mb-2 flex items-center cursor-pointer'
                            >
                                Hình ảnh
                                {openUpload ? (
                                    <FaAngleUp className='inline-block ml-1 text-[16px]' />
                                ) : (
                                    <FaAngleDown className='inline-block ml-1 text-[16px]' />
                                )}
                            </h3>
                            <p className='text-sm my-2'>Thêm hình ảnh để nhận dạng sản phẩm của bạn một cách dễ dàng</p>
                            {openUpload && (
                                <div className='mt-1'>
                                    <Upload onSelectedFiles={handleOnSelectedFiles} id='upload-product' />
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
                    </div>
                </div>
                <div className='flex justify-end gap-4 py-14'>
                    <Link to={PATH.PRODUCT_LIST}>
                        <MyButton className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>
                    <MyButton
                        loading={uploadImagesMutation.isPending || updateProductMutation.isPending}
                        className='rounded-[3px] h-9 w-36'
                    >
                        <p className='font-semibold text-[14px]'>Lưu sản phẩm</p>
                    </MyButton>
                </div>
            </form>
            <div className='bg-white pb-20'>
                <h3 className='text-base font-medium text-gray-900 pt-4 px-4'>Thông tin phiên bản</h3>
                <div className='px-4'>
                    <ShowMessage
                        severity='warn'
                        detail='Chỉnh sửa trực tiếp thông tin của phiên bản nhưng có thể sẽ không tạo ra sự đồng nhất với sản phẩm. Hãy chỉnh sửa nếu điều đó là cần thiết. Đối với xóa thì chỉ xóa được phiên bản nào không có sự ràng buộc dữ liệu'
                    />
                </div>
                <Divider />
                <DataTable
                    value={(product?.variants as unknown as DataTableValueArray) ?? []}
                    dataKey='id'
                    header={selectedVariant.length > 0 && selectedHeader}
                    tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                    selectionMode='checkbox'
                    selection={selectedVariant}
                    className='shadow'
                    onSelectionChange={onSelectionChange}
                    globalFilter={globalFilter}
                >
                    <Column selectionMode='multiple' className='w-[100px]' />

                    <Column className='w-2/5' field='name' header='Tên phiên bản' body={variantNameTemplate} />
                    <Column field='sku' header='Mã sku' body={variantSkuTemplate} />
                    <Column field='color' header='Màu sắc' body={variantColorTemplate} />
                    <Column field='size' header='Kích thước' body={variantSizeTemplate} />
                </DataTable>
            </div>
        </div>
    )
}
