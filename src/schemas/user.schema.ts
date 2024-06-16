import * as yup from 'yup'
export const userSchema = yup.object({
    full_name: yup.string().required('Họ tên không được bỏ trống').min(4, 'Họ tên phải từ 4 ký tự'),
    email: yup.string().required('Email không được bỏ trống').email('Email không đúng định dạng'),
    phone_number: yup
        .string()
        .required('Số điện thoại không được bỏ trống')
        .isValidPhoneNumber('Số điện thoại không đúng định dạng'),
    date_of_birth: yup.string().required('Ngày sinh không được bỏ trống'),
    status: yup.string().required('Trạng thái không được bỏ trống')
})

export type UserSchemaType = yup.InferType<typeof userSchema>
