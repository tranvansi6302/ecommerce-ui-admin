import { Button } from 'primereact/button'
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions
} from 'primereact/fileupload'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import { useRef, useState } from 'react'

interface UploadProps {
    id: string
}

export default function Upload({ id }: UploadProps) {
    const toast = useRef<Toast>(null)
    const [totalSize, setTotalSize] = useState(0)
    const fileUploadRef = useRef<FileUpload>(null)

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize
        let files = e.files

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0
        }

        setTotalSize(_totalSize)
    }

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0

        e.files.forEach((file) => {
            _totalSize += file.size || 0
        })

        setTotalSize(_totalSize)
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size)
        callback()
    }

    const onTemplateClear = () => {
        setTotalSize(0)
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
            <div className='flex align-items-center flex-wrap py-0'>
                <div className='flex align-items-center' style={{ width: '40%' }}>
                    <img className='h-[50px]' alt={file.name} role='presentation' src={URL.createObjectURL(file)} width={50} />
                    <span className='flex flex-column text-left ml-3'>{file.name}</span>
                </div>

                <Button
                    type='button'
                    icon='pi pi-trash'
                    severity='danger'
                    text
                    className='ml-auto'
                    style={{ borderRadius: '50%' }}
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className='flex items-center justify-center'>
                <i
                    className='pi pi-image p-5'
                    style={{
                        fontSize: '3em',
                        color: '#d3d3d3',
                        borderRadius: '50%'
                    }}
                ></i>
                <span style={{ fontSize: '14px', color: 'var(--text-color-secondary)' }} className='my-5'>
                    Chưa có hình ảnh
                </span>
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
                name='demo[]'
                id={id}
                url='/api/upload'
                multiple
                accept='image/*'
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
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
