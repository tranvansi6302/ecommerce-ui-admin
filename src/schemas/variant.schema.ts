import * as yup from 'yup'
export const variantSchema = yup.object({
    variant_name: yup.string().required('Tên phien bản không được bỏ trống').trim(),
    sku: yup.string().required('SKU không được bỏ trống').trim(),
    color: yup.string().required('Màu sắc không được bỏ trống').trim(),
    size: yup.string().required('Kích thước không được bỏ trống').trim()
})

export type VariantSchemaType = yup.InferType<typeof variantSchema>
