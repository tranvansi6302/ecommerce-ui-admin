import * as yup from 'yup'
export const orderSchema = yup.object({
    canceled_reason: yup.string().required('Vui lòng nhập lý do hủy đơn hàng')
})

export const rejectOrderSchema = yup.object({
    rejected_reason: yup.string().required('Vui lòng nhập lý do từ chối đổi trả')
})

export type OrderSchemaType = yup.InferType<typeof orderSchema>
export type RejectOrderSchemaType = yup.InferType<typeof rejectOrderSchema>
