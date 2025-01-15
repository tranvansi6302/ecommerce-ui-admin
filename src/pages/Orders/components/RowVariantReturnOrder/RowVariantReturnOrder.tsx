import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { ReturnOrderResponse } from '~/@types/returnOrder'

interface RowVariantReturnOrderProps {
    data: ReturnOrderResponse
    sizeColorOld: (rowData: ReturnOrderResponse) => string
    sizeColorNew: (rowData: ReturnOrderResponse) => string
    priceOld: (rowData: ReturnOrderResponse) => string | number
    priceNew: (rowData: ReturnOrderResponse) => string | number
}
export default function RowVariantReturnOrder({
    data,
    sizeColorOld,
    sizeColorNew,
    priceOld,
    priceNew
}: RowVariantReturnOrderProps) {
    return (
        <div className='px-3'>
            <DataTable value={[data]} tableStyle={{ fontSize: '14px' }}>
                <Column body={sizeColorOld} header='Màu sắc kích cỡ cũ'></Column>
                <Column body={sizeColorNew} header='Màu sắc kích cỡ yêu cầu'></Column>
                <Column body={priceOld} header='Giá cũ'></Column>
                <Column body={priceNew} header='Giá mới'></Column>
            </DataTable>
        </div>
    )
}
