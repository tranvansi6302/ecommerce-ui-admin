import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import MyButton from '../MyButton'

interface Props {
    onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileFromLocal = event.target.files?.[0]
        fileInputRef.current?.setAttribute('value', '')
        if (fileFromLocal && (fileFromLocal.size >= 5 * 1048576 || !fileFromLocal.type.includes('image'))) {
            toast.error(`Dung lượng file tối đa 5 MB. Định dạng:.JPG, .JPEG, .PNG`)
        } else {
            onChange && onChange(fileFromLocal)
        }
    }
    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <Fragment>
            <input
                className='hidden'
                type='file'
                accept='.jpg,.jpeg,.png'
                ref={fileInputRef}
                onChange={onFileChange}
                onClick={(event) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(event.target as any).value = null
                }}
            />
            <MyButton outlined className='rounded-sm px-6' onClick={handleUpload} type='button'>
                Chọn ảnh
            </MyButton>
        </Fragment>
    )
}
