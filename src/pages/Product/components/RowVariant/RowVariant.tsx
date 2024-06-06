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
    purchasePriceTemplate,
    salePriceTemplate
}: RowVariantProps) {
    return (
        <div className='px-3'>
            <DataTable value={data.variants} tableStyle={{ fontSize: '14px' }}>
                <Column body={variantNameTemplate} field='name' header='Phiên bản'></Column>
                <Column body={warehouseTemplate} field='stock' header='Tồn kho'></Column>
                <Column field='costPrice' header='Giá nhập' body={purchasePriceTemplate} sortable></Column>
                <Column field='salePrice' header='Giá bán' body={salePriceTemplate} sortable></Column>
            </DataTable>
        </div>
    )
}
