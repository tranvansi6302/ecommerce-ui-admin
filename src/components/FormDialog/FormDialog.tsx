import { Dialog } from 'primereact/dialog'
import React from 'react'
import MyButton from '../MyButton'
interface FormDialogProps {
    header: string
    content: React.ReactNode
    visible: boolean
    onConfirm: () => void
    onClose: () => void
    btnSaveName: string
}
export default function FormDialog({ header, content, visible, btnSaveName, onConfirm, onClose }: FormDialogProps) {
    const handleConfirm = () => {
        onConfirm()
    }
    const footerContent = (
        <div>
            <div className='flex justify-end gap-4 py-2'>
                <MyButton onClick={onClose} className='rounded-[3px] h-9' outlined>
                    <p className='font-semibold text-[14px]'>Thoát</p>
                </MyButton>

                <MyButton onClick={handleConfirm} className='rounded-[3px] h-9'>
                    <p className='font-semibold text-[14px]'>{btnSaveName}</p>
                </MyButton>
            </div>
        </div>
    )

    return (
        <Dialog
            header={<p className='font-medium text-gray-900'>{header}</p>}
            visible={visible}
            style={{ width: '45vw' }}
            onHide={onClose}
            footer={footerContent}
        >
            <div className='m-0'>{content}</div>
        </Dialog>
    )
}
