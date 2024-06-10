import * as yup from 'yup'

yup.addMethod(yup.string, 'isValidPhoneNumber', function (message: string) {
    return this.test({
        name: 'isValidPhoneNumber',
        message: message,
        test: (value: any) => {
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
            if (!phoneRegex.test(value)) {
                return false
            }
            return true
        }
    })
})

export const supplierSchema = yup.object({
    name: yup.string().required('Tên nhà cung cấp bắt buộc nhập').trim(),
    tax_code: yup.string().required('Mã số thuế bắt buộc nhập').trim(),
    email: yup.string().required('Email bắt buộc nhập').email('Email không hợp lệ').trim(),
    phone_number: yup.string().required('Số điện thoại bắt buộc nhập').isValidPhoneNumber('Số điện thoại không hợp lệ').trim(),
    address: yup.string().required('Địa chỉ bắt buộc nhập').trim(),
    status: yup.string().required('Trạng thái bắt buộc nhập').trim()
})

export type SupplierSchemaType = yup.InferType<typeof supplierSchema>
