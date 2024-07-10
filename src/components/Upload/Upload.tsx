import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload'
import { Tooltip } from 'primereact/tooltip'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface UploadProps {
    id: string
    onSelectedFiles?: (files: File[]) => void
}

export default function Upload({ id, onSelectedFiles }: UploadProps) {
    const [totalSize, setTotalSize] = useState(0)
    const [numFiles, setNumFiles] = useState(0) // Add this line
    const fileUploadRef = useRef<FileUpload>(null)

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize
        const files = e.files

        // If the total number of files exceeds 5, prevent the new files from being added
        if (numFiles + files.length > 5) {
            e.originalEvent.preventDefault()
            toast.warn('Số lượng hình ảnh tối đa là 5')
            return
        }
        if (_totalSize > 5 * 1024 * 1024) {
            e.originalEvent.preventDefault()
            toast.warn('Dung lượng tối đa là 5MB')
            return
        }

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0
        }
        setTotalSize(_totalSize)
        setNumFiles(numFiles + files.length) // Update the number of files
        onSelectedFiles && onSelectedFiles(files)
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size)
        setNumFiles(numFiles - 1) // Decrease the number of files
        callback()
    }

    const onTemplateClear = () => {
        setTotalSize(0)
        setNumFiles(0) // Reset the number of files
    }

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, cancelButton } = options

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        )
    }

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File
        return (
            <div className='border flex items-center justify-center p-3 rounded-md w-[100px] h-[100px] border-gray-300 relative'>
                <img className='w-full h-full object-cover' alt={file.name} role='presentation' src={URL.createObjectURL(file)} />
                <button
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                    className='absolute top-1 right-1 text-gray-500 hover:opacity-80'
                >
                    <i className='pi pi-fw pi-times text-[14px]'></i>
                </button>
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div style={{ display: 'flex' }} className='items-center justify-center w-full'>
                <button className='w-[20%]'>
                    <i
                        className='pi pi-images p-5'
                        style={{
                            fontSize: '3em',
                            color: '#d3d3d3',
                            borderRadius: '50%'
                        }}
                    ></i>
                </button>
                <p style={{ fontSize: '14px', color: 'var(--text-color-secondary)' }} className='my-5 w-[80%]'>
                    Chấp nhận đuôi .jpg, .jpeg, .png, dung lượng tối đa 5MB, tối đa 5 hình ảnh
                </p>
            </div>
        )
    }

    const chooseOptions = {
        icon: 'pi pi-fw pi-upload',
        iconOnly: true
    }
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true
    }

    return (
        <div className=''>
            <Tooltip target='.custom-choose-btn' position='bottom' />
            <Tooltip target='.custom-cancel-btn' position='bottom' />
            <FileUpload
                ref={fileUploadRef}
                name='files[]'
                id={id}
                multiple
                accept='image/*'
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                progressBarTemplate={() => null}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    )
}
