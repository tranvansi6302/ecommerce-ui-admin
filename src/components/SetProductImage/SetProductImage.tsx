import { Fragment } from 'react'
import { ProductImage } from '~/@types/product'
import DefaultProductImage from '../DefaultProductImage'

interface ProductImageProps {
    productImages: ProductImage[]
}

export default function SetProductImage({ productImages }: ProductImageProps) {
    return (
        <Fragment>
            {productImages.length > 0 ? (
                <div className='w-[40px] h-[40px] bg-gray-50 rounded-md flex justify-center items-center'>
                    <img src={productImages[0].url} alt='product_image' />
                </div>
            ) : (
                <div className='w-[40px] h-[40px] bg-gray-100 rounded-md flex justify-center items-center'>
                    <DefaultProductImage height='28px' />
                </div>
            )}
        </Fragment>
    )
}
