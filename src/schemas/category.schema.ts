import * as yup from 'yup'
export const categorySchema = yup.object({
    name: yup
        .string()
        .required('Tên loại sản phẩm không được bỏ trống')
        .min(3, 'Tên loại sản phẩm phải lớn hơn 3 ký tự')
        .max(50, 'Tên loại sản phẩm không được lớn hơn 50 ký tự')
})

export type CategorySchemaType = yup.InferType<typeof categorySchema>
