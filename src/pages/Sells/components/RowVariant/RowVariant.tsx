import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

interface RowVariantProps {
    data: any
    variantNameTemplate: any
    warehouseTemplate: any
    purchasePriceTemplate: any
    salePriceTemplate: any
}
export default function RowVariant({
    data,
    variantNameTemplate,
    warehouseTemplate,
    currentPriceTemplate,
    applyDateTemplate
}: RowVariantProps) {
    return (
        <div className='px-3'>
            <DataTable value={data.variants} tableStyle={{ fontSize: '14px' }}>
                <Column className='w-[40%]' body={variantNameTemplate} field='name' header='Phiên bản'></Column>
                <Column body={warehouseTemplate} field='stock' header='Tồn kho'></Column>
                <Column field='' header='Giá hiện tại' body={currentPriceTemplate} sortable></Column>
                <Column field='' header='Thời gian áp dụng' body={applyDateTemplate} sortable></Column>
            </DataTable>
        </div>
    )
}
