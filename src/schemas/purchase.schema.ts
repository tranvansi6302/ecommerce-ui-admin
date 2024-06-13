import * as yup from 'yup'

const purchaseDetailSchema = yup.object({
    variant_id: yup.string().required('Sản phẩm không được bỏ trống').trim(),
    quantity: yup.number().required('Số lượng không được bỏ trống').min(1, 'Số lượng tối thiểu là 1'),
    purchase_price: yup.number().required('Giá mua không được bỏ trống').min(0, 'Giá mua tối thiểu là 0'),
    note: yup.string().trim()
})

export const createPurchaseSchema = yup.object({
    note: yup.string().trim(),
    supplier_id: yup.string().required('Nhà cung cấp không được bỏ trống').trim(),
    purchase_order_code: yup.string().required('Mã đơn hàng không được bỏ trống').trim(),
    purchase_details: yup.array().of(purchaseDetailSchema)
})

export type PurchaseSchemaType = yup.InferType<typeof createPurchaseSchema>
export type PurchaseDetailSchemaType = yup.InferType<typeof purchaseDetailSchema>
