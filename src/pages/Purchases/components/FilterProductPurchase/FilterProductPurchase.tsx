import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { Dialog } from 'primereact/dialog'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useCallback, useEffect, useState } from 'react'
import { MdOutlineFilterAlt } from 'react-icons/md'
import { Brand } from '~/@types/brand'
import { Category } from '~/@types/category'
import { Variant } from '~/@types/variant'
import brandsApi from '~/apis/brands.api'
import categoriesApi from '~/apis/categories.api'
import variantsApi from '~/apis/variants.api'
import DefaultProductImage from '~/components/DefaultProductImage'
import MyButton from '~/components/MyButton'
import MyDrowdown from '~/components/MyDrowdown'
import MyInputSearch from '~/components/MyInputSearch'

interface FilterProductProps {
    search: string
    setSearch: (value: string) => void
    rowVariants: Variant[]
    setRowVariants: (value: Variant[] | any) => void
}

export default function FilterProductPurchase({ search, setSearch, rowVariants, setRowVariants }: FilterProductProps) {
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [isFocused, setIsFocused] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [checkedVariantsDialog, setCheckedVariantsDialog] = useState<Variant[]>([])
    const [, setInitialCheckedVariants] = useState<Variant[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value) => {
            setDebouncedSearch(value)
        }, 1000),
        []
    )

    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false)
        } else {
            debouncedSetSearch(search)
        }
    }, [search, debouncedSetSearch, isInitialLoad])

    const { data: variants } = useQuery({
        queryKey: ['variants', { search: debouncedSearch }, selectedCategory, selectedBrand],
        queryFn: () =>
            variantsApi.getAllVariants({
                search: debouncedSearch,
                category: selectedCategory?.slug || '',
                brand: selectedBrand?.slug || ''
            }),
        placeholderData: keepPreviousData,
        enabled: isInitialLoad || debouncedSearch !== '' || !!selectedCategory || !!selectedBrand
    })

    const handleToggleVariantDialog = (variant: Variant) => {
        setCheckedVariantsDialog((prevChecked) => {
            const isChecked = prevChecked.some((v) => v.sku === variant.sku)
            if (isChecked) {
                return prevChecked.filter((v) => v.sku !== variant.sku)
            } else {
                return [...prevChecked, variant]
            }
        })
    }

    const handleAddRowVariant = (variant: Variant) => {
        const existingDetail = rowVariants.find((variant) => variant.sku === variant.sku)
        if (existingDetail?.id === variant.id) return
        setRowVariants((prevVariants: Variant[]) => [...prevVariants, variant])
    }

    const handleConfirmSelection = () => {
        const selectedVariants = checkedVariantsDialog
        let updatedRowVariants = [...rowVariants]

        updatedRowVariants = updatedRowVariants.filter((detail) =>
            selectedVariants.some((selected) => selected.sku === detail.sku)
        )

        setRowVariants(updatedRowVariants)
        selectedVariants.forEach((variant) => {
            const existingDetail = rowVariants.find((detail) => detail.sku === variant.sku)

            if (!existingDetail) {
                updatedRowVariants.push(variant)
            }
        })
        setRowVariants(updatedRowVariants)
        setOpen(false)
    }

    const { data: brands } = useQuery({
        queryKey: ['brands'],
        queryFn: () => brandsApi.getAllBrands(),
        placeholderData: keepPreviousData
    })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAllCategories(),
        placeholderData: keepPreviousData
    })

    return (
        <div>
            <div className='relative flex justify-content-between gap-2'>
                <div className='w-4/6 relative'>
                    <div className='w-full'>
                        <MyInputSearch
                            className='pl-10 py-0 font-normal h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo tên, mã nhà cung cấp'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            value={search}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                        />
                    </div>
                    {isFocused && variants?.data?.result && (
                        <ul className='absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-80 overflow-y-auto shadow'>
                            {variants.data.result.map((variant: Variant) => (
                                <li
                                    onClick={() => handleAddRowVariant(variant)}
                                    key={variant.sku}
                                    className='flex items-center gap-4 p-2 border-b border-gray-200 cursor-pointer py-3 hover:bg-blue-50'
                                >
                                    <div className='flex gap-4 w-[80%]'>
                                        <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                                            <DefaultProductImage height='28px' />
                                        </div>
                                        <div className='font-normal text-[13.6px] flex flex-col gap-1'>
                                            <p className='text-gray-900'>{variant.variant_name}</p>
                                            <p className='text-sm text-blue-500'>{variant.sku}</p>
                                        </div>
                                    </div>
                                    <div className='text-gray-500 font-normal text-[13.6px] flex flex-col items-start gap-2'>
                                        <p className=''>Giá nhập: {variant.warehouse ? variant.warehouse.purchase_price : 0}</p>
                                        <p>Tồn: {variant.warehouse ? variant.warehouse.available_quantity : 0}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <MyButton
                    outlined
                    type='button'
                    className='rounded-sm'
                    onClick={() => {
                        setOpen(true)
                        setInitialCheckedVariants([...checkedVariantsDialog])
                    }}
                >
                    <MdOutlineFilterAlt fontSize='20px' />
                    <p className='text-[14px] font-normal ml-2'> Chọn nhanh</p>
                </MyButton>
                <Dialog
                    header={<p className='font-normal text-gray-900'>Chọn nhanh sản phẩm</p>}
                    visible={open}
                    style={{ width: '65vw' }}
                    onHide={() => {
                        if (!open) return
                        setOpen(false)
                    }}
                    onShow={() => {
                        // Update checkedVariantsDialog based on rowVariants when the dialog opens
                        setCheckedVariantsDialog(rowVariants.map((detail) => detail))
                    }}
                >
                    <div className='m-0'>
                        <div className='flex items-center justify-between mt-1'>
                            <div className='w-[45%]'>
                                <MyInputSearch
                                    className='pl-10 py-0 font-normal h-[40px] w-full flex items-center'
                                    style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                    name='search'
                                    placeholder='Tìm kiếm theo tên, mã nhà cung cấp'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                    value={search}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                                />
                            </div>
                            <div className='flex items-center w-[55%]'>
                                <MyDrowdown
                                    value={selectedBrand}
                                    onChange={(e: DropdownChangeEvent) => setSelectedBrand(e.value)}
                                    options={brands?.data.result}
                                    optionLabel='name'
                                    placeholder='Chọn thương hiệu'
                                    name='brand'
                                />
                                <MyDrowdown
                                    value={selectedCategory}
                                    onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)}
                                    options={categories?.data.result}
                                    optionLabel='name'
                                    placeholder='Chọn loại sản phẩm'
                                    name='category'
                                />
                                <MyDrowdown
                                    value={selectedCategory}
                                    onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)}
                                    options={categories?.data.result}
                                    optionLabel='warehouse'
                                    placeholder='Tình trạng kho'
                                    name='warehouse'
                                />
                            </div>
                        </div>
                        <div className='z-10 bg-white mt-5  w-full max-h-80 overflow-y-auto'>
                            {variants?.data?.result &&
                                variants.data.result.map((variant: Variant) => (
                                    <label
                                        htmlFor={variant.id.toString()}
                                        key={variant.id}
                                        className='flex items-center gap-4 p-2 border-b border-gray-200 cursor-pointer py-3 hover:bg-blue-50'
                                    >
                                        <input
                                            id={variant.id.toString()}
                                            type='checkbox'
                                            checked={checkedVariantsDialog.some((v) => v.sku === variant.sku)}
                                            onChange={() => handleToggleVariantDialog(variant)}
                                            className='mr-2'
                                        />
                                        <div className='flex gap-4 w-[80%]'>
                                            <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                                                <DefaultProductImage height='28px' />
                                            </div>
                                            <div className='font-normal text-[13.6px] flex flex-col gap-1'>
                                                <p className='text-gray-900'>{variant.variant_name}</p>
                                                <p className='text-sm text-blue-500'>{variant.sku}</p>
                                            </div>
                                        </div>
                                        <div className='text-gray-500 font-normal text-[13.6px] flex flex-col items-start gap-2'>
                                            <p className=''>
                                                Giá nhập: {variant.warehouse ? variant.warehouse.purchase_price : 0}
                                            </p>
                                            <p>Tồn: {variant.warehouse ? variant.warehouse.available_quantity : 0}</p>
                                        </div>
                                    </label>
                                ))}
                        </div>

                        <div className='flex justify-end gap-4 mt-8'>
                            <MyButton onClick={() => setOpen(false)} className='rounded-[3px] h-9' outlined>
                                <p className='font-semibold text-[14px]'>Thoát</p>
                            </MyButton>

                            <MyButton onClick={handleConfirmSelection} className='rounded-[3px] h-9 w-36'>
                                <p className='font-semibold text-[14px]'>Xác nhận</p>
                            </MyButton>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
