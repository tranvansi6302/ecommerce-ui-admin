import * as yup from 'yup'
export const productSchema = yup.object({
    name: yup
        .string()
        .required('Tên sản phẩm không được bỏ trống')
        .min(3, 'Tên sản phẩm tối thiểu 3 ký tự')
        .max(200, 'Tên sản phẩm tối đa 100 ký tự')
        .trim(),
    category_id: yup.string().required('Loại sản phẩm không được bỏ trống'),
    brand_id: yup.string().required('Thương hiệu không được bỏ trống'),
    sku: yup.string().required('SKU không được bỏ trống').trim()
})

export type ProductSchemaType = yup.InferType<typeof productSchema>
