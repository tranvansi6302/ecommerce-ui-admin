import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Nullable } from 'primereact/ts-helpers'
import MyButton from '~/components/MyButton'
import MyInputNumberV2Blur from '~/components/MyInputNumberV2Blur'

interface QuickApplyDialogProps {
    visible: boolean
    onHide: () => void
    onApply: () => void
    setQuickApplyStartDate: (value: Nullable<Date>) => void
    setQuickApplyEndDate: (value: Nullable<Date>) => void
    setQuickApplyPercentage: (value: number | '') => void
    setQuickApplyPercentagePromotion: (value: number | '') => void
    quickApplyStartDate: Nullable<Date>
    quickApplyEndDate: Nullable<Date>
    quickApplyPercentage: number | ''
    quickApplyPercentagePromotion: number | ''
}

export default function QuickApplyDialog({
    visible,
    onHide,
    onApply,
    setQuickApplyStartDate,
    setQuickApplyEndDate,
    setQuickApplyPercentage,
    setQuickApplyPercentagePromotion,
    quickApplyStartDate,
    quickApplyEndDate,
    quickApplyPercentage,
    quickApplyPercentagePromotion
}: QuickApplyDialogProps) {
    return (
        <Dialog
            header={<p className='font-medium'>Áp dụng nhanh giá bán</p>}
            visible={visible}
            style={{ width: '40vw' }}
            onHide={onHide}
        >
            <div className='p-fluid'>
                <div className='field flex flex-col'>
                    <label className='text-[13.6px]' htmlFor='quickApplyStartDate'>
                        Ngày bắt đầu
                    </label>
                    <Calendar
                        placeholder='mm/dd/yyyy'
                        className='h-[40px]'
                        id='quickApplyStartDate'
                        value={quickApplyStartDate}
                        onChange={(e) => setQuickApplyStartDate(e.value)}
                        showIcon
                    />
                </div>
                <div className='field flex flex-col mt-4'>
                    <label className='text-[13.6px]' htmlFor='quickApplyEndDate'>
                        Ngày kết thúc
                    </label>
                    <Calendar
                        placeholder='mm/dd/yyyy'
                        className='h-[40px]'
                        id='quickApplyEndDate'
                        value={quickApplyEndDate}
                        onChange={(e) => setQuickApplyEndDate(e.value)}
                        showIcon
                    />
                </div>

                <div className='field mt-4'>
                    <MyInputNumberV2Blur
                        keyfilter='pint'
                        name='quickApplyPercentage'
                        placeholder='Nhập số %'
                        label='Giá bán ra so với giá nhập (%)'
                        className='w-full h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                        classNameLabel='text-[13.6px]'
                        style={{ fontSize: '13.6px' }}
                        value={quickApplyPercentage}
                        onBlur={(e) => setQuickApplyPercentage(e.target.value)}
                    />
                </div>

                <div className='field mt-4'>
                    <MyInputNumberV2Blur
                        keyfilter='pint'
                        name='quickApplyPercentagePromotion'
                        placeholder='Nhập số %'
                        label='Giá khuyến mãi so với giá nhập (%)'
                        className='w-full h-[40px] rounded-none border-t-0 border-l-0 border-r-0'
                        classNameLabel='text-[13.6px]'
                        style={{ fontSize: '13.6px' }}
                        value={quickApplyPercentagePromotion}
                        onBlur={(e) => setQuickApplyPercentagePromotion(e.target.value)}
                    />
                </div>

                <div className='flex justify-end gap-4 pt-6'>
                    <MyButton className='rounded-[3px] h-9' outlined onClick={onHide}>
                        <p className='font-semibold text-[14px]'>Thoát</p>
                    </MyButton>

                    <MyButton onClick={onApply} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Xác nhận</p>
                    </MyButton>
                </div>
            </div>
        </Dialog>
    )
}
