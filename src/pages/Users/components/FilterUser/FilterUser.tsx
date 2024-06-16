import { omit } from 'lodash'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { UserStatus } from '~/@types/user'
import MyButton from '~/components/MyButton'
import MyDropdown from '~/components/MyDrowdown/MyDropdown'
import MyInputSearch from '~/components/MyInputSearch'
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

    return (
        <div>
            <p className='font-medium text-[14px] text-blue-600 pb-2 border-b-2 border-blue-500 inline-block mb-3'>
                Danh sách khách hàng
            </p>
            <div className='flex justify-content-between gap-2'>
                <form className='w-2/5' onSubmit={handleSerach}>
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
                <div className='flex items-baseline gap-2'>
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
            </div>
        </div>
    )
}
