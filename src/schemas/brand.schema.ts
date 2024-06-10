import * as yup from 'yup'
export const brandSchema = yup.object({
    name: yup
        .string()
        .required('Tên thương hiệu không được bỏ trống')
        .min(3, 'Tên thương hiệu phải lớn hơn 3 ký tự')
        .max(50, 'Tên thương hiệu không được lớn hơn 50 ký tự')
})

export type BrandSchemaType = yup.InferType<typeof brandSchema>
