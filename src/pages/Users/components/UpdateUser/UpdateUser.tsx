import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Calendar } from 'primereact/calendar'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { Nullable } from 'primereact/ts-helpers'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoChevronBackOutline } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserStatus } from '~/@types/user'
import { MessageResponse } from '~/@types/util'
import usersApi, { UpdateUserRequest } from '~/apis/users.api'
import DefaultAvatarUser from '~/components/DefaultAvatarUser'
import InputFile from '~/components/InputFile/InputFile'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInput from '~/components/MyInput'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import useSetTitle from '~/hooks/useSetTitle'
import { userSchema } from '~/schemas/user.schema'
import { convertToLocaleDateTime } from '~/utils/format'

const userStatus: UserStatus[] = [
    { id: 1, status: 'Hoạt động', db: 'ACTIVE' },
    { id: 0, status: 'Vô hiệu hóa', db: 'BLOCKED' }
]

export default function UpdateUser() {
    useSetTitle('Cập nhật khách hàng')
    const navigate = useNavigate()
    const { id: userId } = useParams<{ id: string }>()
    const [message, setMessage] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<UserStatus>()
    const [dateOfBirth, setDateOfBirth] = useState<Nullable<Date>>(null)
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateUserRequest>({
        resolver: yupResolver(userSchema)
    })

    const { data: user } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => usersApi.getUserById(Number(userId)),
        enabled: !!userId
    })

    useEffect(() => {
        setValue('full_name', user?.data.result.full_name || '')
        setValue('email', user?.data.result.email || '')
        setValue('phone_number', user?.data.result.phone_number || '')
        const dateOfBirth = user?.data.result.date_of_birth && new Date(user?.data.result.date_of_birth || '')
        setDateOfBirth(dateOfBirth || null)
        setValue('date_of_birth', dateOfBirth?.toString() || '')
        const status = userStatus.find((status) => status.db === user?.data.result.status)
        setSelectedStatus(status)
        setValue('status', status?.id.toString() || '')
    }, [setValue, user])

    const [file, setFile] = useState<File>()
    const previewImage = useMemo(() => {
        return file ? URL.createObjectURL(file) : ''
    }, [file])

    const handleChangeFile = (file?: File) => {
        setFile(file)
    }
    const uploadAvatarUserMutation = useMutation({
        mutationFn: (payload: { id: number; body: FormData }) => usersApi.uploadAvatarUser(payload.id, payload.body)
    })

    const updateUserMutation = useMutation({
        mutationFn: (payload: { id: number; body: UpdateUserRequest }) => usersApi.updateUser(payload.id, payload.body)
    })
    const onSubmit = handleSubmit(async (data) => {
        setMessage('')
        if (file) {
            console.log(file)
            const form = new FormData()
            form.append('file', file)
            const payload = {
                id: Number(userId),
                body: form
            }

            await uploadAvatarUserMutation.mutateAsync(payload, {
                onError: (error) => {
                    const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                    setMessage(errorResponse?.message ?? '')
                    toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
                }
            })
        }
        const payloadJson = {
            id: Number(userId),
            body: {
                ...data,
                date_of_birth: convertToLocaleDateTime(dateOfBirth?.toString() || ''),
                status: selectedStatus?.id.toString() || '',
                roles: ['USER']
            }
        }
        await updateUserMutation.mutateAsync(payloadJson, {
            onSuccess: () => {
                toast.success(MESSAGE.UPDATE_USER_SUCCESS)
                navigate(PATH.USER_LIST)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
                toast.warn(MESSAGE.PLEASE_CHECK_DATA_INPUT)
            }
        })
    })

    return (
        <div className='card w-full py-4 px-10 '>
            <Link to={PATH.USER_LIST} className='flex items-center gap-2 mb-2 text-[14px] text-gray-600'>
                <IoChevronBackOutline />
                <p>Danh sách khách hàng</p>
            </Link>
            <h2 className='text-[24px] font-semibold text-gray-900 mb-8'>Cập nhật thông tin khách hàng</h2>
            <form onSubmit={onSubmit}>
                <div className='bg-white p-5'>
                    {message && <ShowMessage severity='warn' detail={message} />}
                    <div className='grid grid-cols-2 gap-5'>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='full_name'
                                placeholder='Họ tên'
                                label='Nhập họ tên'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='email'
                                placeholder='Nhập địa chỉ email'
                                label='Địa chỉ email'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-normal text-gray-800 text-[13.6px] mb-1'>Ngày sinh</label>
                            <Calendar
                                {...register('date_of_birth')}
                                value={dateOfBirth}
                                showIcon
                                onChange={(e) => {
                                    setDateOfBirth(e.value)
                                    setValue('date_of_birth', e.value?.toString() || '')
                                }}
                                id='date_of_birth'
                                style={{
                                    border: errors.date_of_birth ? '1px solid red' : ''
                                }}
                                placeholder='mm/dd/yyyy'
                                className='h-[40px] w-full'
                            />
                            {errors.date_of_birth && (
                                <p className='mb-4 mt-1 text-red-500 text-[13.6px] px-2'>{errors.date_of_birth.message}</p>
                            )}
                        </div>
                        <div>
                            <MyInput
                                errors={errors}
                                register={register}
                                name='phone_number'
                                placeholder='Nhập số điện thoại'
                                label='Số điện thoại'
                                className='w-full py-0 font-normal h-[40px] flex items-center'
                                classNameLabel='font-normal text-gray-800 text-[13.6px] mb-1'
                                style={{ borderRadius: '2px', fontSize: '13.6px' }}
                                styleMessage={{ fontSize: '13.6px' }}
                            />
                        </div>
                        <div className=''>
                            <label className='text-[13.6px] text-gray-900' htmlFor='status'>
                                Trạng thái
                            </label>
                            <MyDropdown
                                register={register}
                                errors={errors}
                                value={selectedStatus}
                                onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                                options={userStatus}
                                optionLabel='status'
                                placeholder='Trạng thái'
                                name='status'
                                className='mt-1'
                            />
                        </div>
                        <div className=''>
                            <div className='flex flex-col items-center'>
                                <div className='my-5 h-24 w-24'>
                                    {previewImage || user?.data.result.avatar ? (
                                        <img
                                            src={previewImage || user?.data.result.avatar}
                                            alt='avatar'
                                            className='h-full w-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <div className='flex items-center justify-center h-24 w-24'>
                                            <DefaultAvatarUser />
                                        </div>
                                    )}
                                </div>

                                <InputFile onChange={handleChangeFile} />
                                <div className='mt-3 text-gray-400 text-[13.6px]'>
                                    <div>Dụng lượng file tối đa 5 MB</div>
                                    <div>Định dạng:.JPEG, .PNG</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-4 py-14'>
                    <Link to={PATH.SUPPLIER_LIST}>
                        <MyButton className='rounded-[3px] h-9' outlined>
                            <p className='font-semibold text-[14px]'>Thoát</p>
                        </MyButton>
                    </Link>
                    <MyButton loading={false} className='rounded-[3px] h-9 w-36'>
                        <p className='font-semibold text-[14px]'>Lưu nhà cung cấp</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
