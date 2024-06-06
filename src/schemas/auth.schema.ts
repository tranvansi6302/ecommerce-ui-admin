import * as yup from 'yup'
export const authSchema = yup.object({
    email: yup.string().required('Email không được bỏ trống').email('Email không đúng định dạng'),
    password: yup.string().required('Mật khẩu không được bỏ trống').min(6, 'Mật khẩu tối thiếu 6 ký tự')
})

export type AuthSchemaType = yup.InferType<typeof authSchema>
