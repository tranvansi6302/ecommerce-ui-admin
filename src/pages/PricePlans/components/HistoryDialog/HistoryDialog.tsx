import { Column } from 'primereact/column'
import { DataTable, DataTableValueArray } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { PricePlan } from '~/@types/variant'
import MyButton from '~/components/MyButton'
import { formatDate } from '~/utils/format'

interface HistoryDialogProps {
    visible: boolean
    onHide: () => void
    warehouse: any
}

export default function HistoryDialog({ visible, onHide, warehouse }: HistoryDialogProps) {
    const warehouseSalePriceTemplate = (rowData: PricePlan) => rowData.sale_price ?? 'Không có'
    const warehousePromotionPriceTemplate = (rowData: PricePlan) => rowData.promotion_price ?? 'Không khuyến mãi'
    const warehouseStartDateTemplate = (rowData: PricePlan) => formatDate(rowData.start_date) ?? 'Không có'
    const warehouseEndDateTemplate = (rowData: PricePlan) => formatDate(rowData.end_date) ?? 'Không có'

    return (
        <Dialog
            header={<p className='font-medium'>Lịch sử giá bán</p>}
            visible={visible}
            style={{ width: '60vw' }}
            onHide={onHide}
        >
            <div className='m-0'>
                <div className='card'>
                    <DataTable
                        value={(warehouse?.data.result.variant.price_plans as unknown as DataTableValueArray) ?? []}
                        tableStyle={{ minWidth: '50rem' }}
                    >
                        <Column body={warehouseSalePriceTemplate} header='Giá bán'></Column>
                        <Column body={warehousePromotionPriceTemplate} header='Giá khuyến mãi'></Column>
                        <Column body={warehouseStartDateTemplate} header='Ngày bắt đầu'></Column>
                        <Column body={warehouseEndDateTemplate} header='Ngày kết thúc'></Column>
                    </DataTable>
                </div>
                <div className='flex justify-end gap-4 pt-6'>
                    <MyButton onClick={onHide} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Đóng</p>
                    </MyButton>
                </div>
            </div>
        </Dialog>
    )
}
