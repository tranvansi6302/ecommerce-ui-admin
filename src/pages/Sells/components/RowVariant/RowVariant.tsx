import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

interface RowVariantProps {
    data: any
    variantNameTemplate: any
    warehouseTemplate: any
    currentPriceTemplate: any
    applyDateTemplate: any
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
                <Column field='currentPriceTemplate' header='Giá hiện tại' body={currentPriceTemplate}></Column>
                <Column field='applyDateTemplate' header='Thời gian áp dụng' body={applyDateTemplate}></Column>
            </DataTable>
        </div>
    )
}
