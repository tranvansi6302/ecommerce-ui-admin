import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Order, OrderDetail } from '~/@types/order'

interface RowVariantProps {
    data: Order
    variantNameTemplate: (rowData: OrderDetail) => string
    imageTemplate: (rowData: OrderDetail) => JSX.Element
    quantityTemplate: (rowData: OrderDetail) => number
    priceTemplate: (rowData: OrderDetail) => number | 0
}
export default function RowVariant({
    data,
    imageTemplate,
    variantNameTemplate,
    quantityTemplate,
    priceTemplate
}: RowVariantProps) {
    return (
        <div className='px-3'>
            <DataTable value={data.order_details} tableStyle={{ fontSize: '14px' }}>
                <Column body={imageTemplate} header='Ảnh'></Column>
                <Column className='w-3/5' body={variantNameTemplate} header='Sản phẩm'></Column>
                <Column field='quantity' header='Số lượng' body={quantityTemplate} sortable></Column>
                <Column field='price' header='Giá đặt' body={priceTemplate} sortable></Column>
            </DataTable>
        </div>
    )
}
