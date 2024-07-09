import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaTrashAlt } from 'react-icons/fa'
import { MdOutlineArrowBackIos } from 'react-icons/md'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { UserStatus } from '~/@types/user'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'
import ShowMessage from '~/components/ShowMessage'
import PATH from '~/constants/path'
import useQueryUsers from '~/hooks/useQueryUsers'

const useStatus: UserStatus[] = [
    { id: 1, status: 'Đang hoạt động' },
    { id: 0, status: 'Vô hiệu hóa' }
]

interface FilterUserProps {
    search: string
    setSearch: (value: string) => void
    selectedUserStatus: UserStatus | null
    setSelectedUserStatus: (value: UserStatus | null) => void
}

export default function FilterUser({ search, setSearch, selectedUserStatus, setSelectedUserStatus }: FilterUserProps) {
    const navigate = useNavigate()
    const queryConfig = useQueryUsers()
    const { register } = useForm()

    // Active filter
    useEffect(() => {
        if (queryConfig.status) {
            const active = useStatus.find((status) => status.id.toString() === queryConfig.status)
            setSelectedUserStatus(active || null)
        }

        if (queryConfig.email) {
            setSearch(queryConfig.email)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedUserStatus) {
            navigate({
                pathname: PATH.USER_LIST,
                search: createSearchParams({
                    ...queryConfig,
                    status: selectedUserStatus.id.toString()
                }).toString()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserStatus, setSelectedUserStatus])

    const handleSerach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate({
            pathname: PATH.USER_LIST,
            search: createSearchParams({
                ...queryConfig,
                email: search
            }).toString()
        })
    }

    const handleClean = () => {
        setSearch('')
        setSelectedUserStatus(null)
        navigate({
            pathname: PATH.USER_LIST,
            search: createSearchParams(omit(queryConfig, ['email', 'status', 'page', 'limit'])).toString()
        })
    }

    const handleNavigateTrash = () => {
        navigate({
            pathname: PATH.USER_LIST,
            search: createSearchParams({
                ...queryConfig,
                is_deleted: '1'
            }).toString()
        })
    }

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                {queryConfig.is_deleted === '1' ? 'Thùng rác' : 'Danh sách người dùng'}
            </p>
            {queryConfig.is_deleted === '1' && (
                <div className='font-normal'>
                    <ShowMessage
                        severity='error'
                        detail='Người dùng sẽ bị xóa khỏi hệ thống sau 30 ngày kể từ lúc có hiệu lực!'
                    />
                </div>
            )}
            <div className='flex justify-content-between gap-2'>
                <form className='w-[40%]' onSubmit={handleSerach}>
                    <div className='w-full'>
                        <MyInputSearch
                            register={register}
                            className='pl-10 py-0 font-normal  h-[40px] w-full flex items-center'
                            style={{ borderRadius: '2px', fontSize: '13.6px' }}
                            name='search'
                            placeholder='Tìm kiếm theo email'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                </form>
                <div className='flex items-baseline gap-2 w-[40%]'>
                    <div className='w-[250px]'>
                        <MyDropdown
                            value={selectedUserStatus}
                            onChange={(e: DropdownChangeEvent) => setSelectedUserStatus(e.value)}
                            options={useStatus}
                            optionLabel='status'
                            placeholder='Trạng thái'
                            name='status'
                        />
                    </div>

                    <MyButton
                        severity='secondary'
                        icon='pi pi-filter-slash'
                        text
                        className='px-4 py-3 rounded-none text-gray-900 font-semibold'
                        onClick={handleClean}
                    >
                        <p className='ml-1 text-[14px]'>Xóa bộ lọc</p>
                    </MyButton>
                </div>
                <div className='w-[20%] flex justify-end'>
                    {queryConfig.is_deleted !== '1' ? (
                        <button
                            onClick={handleNavigateTrash}
                            className='text-[16px] text-red-600 flex items-center uppercase gap-2 p-4 bg-red-100 rounded-full'
                        >
                            <FaTrashAlt />
                        </button>
                    ) : (
                        <MyButton
                            severity='secondary'
                            icon={<MdOutlineArrowBackIos className='text-blue-600' />}
                            text
                            className='px-4 py-3 rounded-none text-gray-900 font-semibold'
                            onClick={() => navigate(-1)}
                        >
                            <p className='ml-1 text-[15px] text-blue-600'>Quay lại</p>
                        </MyButton>
                    )}
                </div>
            </div>
        </div>
    )
}
