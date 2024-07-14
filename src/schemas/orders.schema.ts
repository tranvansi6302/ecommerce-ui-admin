import * as yup from 'yup'
export const orderSchema = yup.object({
    canceled_reason: yup.string().required('Vui lòng nhập lý do hủy đơn hàng')
})

export type OrderSchemaType = yup.InferType<typeof orderSchema>
