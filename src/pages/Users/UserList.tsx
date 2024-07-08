import { Column } from 'primereact/column'
import {
    DataTable,
    DataTableExpandedRows,
    DataTableSelectionMultipleChangeEvent,
    DataTableValueArray
} from 'primereact/datatable'
import { Dropdown } from 'primereact/dropdown'
import { useCallback, useMemo, useState } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProductFilter } from '~/@types/product'

import { User, UserFilter, UserStatus } from '~/@types/user'
import usersApi from '~/apis/users.api'
import DefaultAvatarUser from '~/components/DefaultAvatarUser'
import MyButton from '~/components/MyButton'
import { USER_STATUS } from '~/constants/status'
import useQueryUsers from '~/hooks/useQueryUsers'
import useSetTitle from '~/hooks/useSetTitle'
import { convertUserStatus, formatDate } from '~/utils/format'
import FilterUser from './components/FilterUser'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import PATH from '~/constants/path'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'

export type QueryConfig = {
    [key in keyof ProductFilter]: string
}

export default function UserList() {
    useSetTitle('Danh sách khách hàng')
    const navigate = useNavigate()
    const queryConfig = useQueryUsers()
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
    const [globalFilter] = useState<string>('')
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [selectedUserStatus, setSelectedUserStatus] = useState<UserStatus | null>(null)
    const [search, setSearch] = useState<string>('')
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(5)

    const { data: users } = useQuery({
        queryKey: ['users', queryConfig],
        queryFn: () => usersApi.getAllUsers(queryConfig as UserFilter),
        placeholderData: keepPreviousData
    })

    const avatarTemplate = useCallback((rowData: User) => {
        return rowData.avatar ? <img className='w-10 h-10 rounded-full' src={rowData.avatar} alt='' /> : <DefaultAvatarUser />
    }, [])
    const fullNameTemplate = useCallback(
        (rowData: User) => (
            <Link to={`${PATH.USER_LIST}/${rowData.id}`} className='text-blue-500 cursor-pointer'>
                <p> {rowData.full_name}</p>
                <p className='mt-1'>{rowData.phone_number ?? 'Chưa có liên hệ'}</p>
            </Link>
        ),
        []
    )
    const emailTemplate = useCallback((rowData: User) => rowData.email, [])
    const statusTemplate = useCallback((rowData: User) => {
        return (
            <MyButton text severity={rowData.status === USER_STATUS.BLOCKED ? 'danger' : 'success'}>
                <p className='text-[13.6px] font-medium'>{convertUserStatus(rowData.status).toUpperCase()}</p>
            </MyButton>
        )
    }, [])
    const createdAtTemplate = useCallback((rowData: User) => formatDate(rowData.created_at), [])

    const header = useMemo(
        () => (
            <FilterUser
                selectedUserStatus={selectedUserStatus}
                setSelectedUserStatus={setSelectedUserStatus}
                search={search}
                setSearch={setSearch}
            />
        ),
        [search, selectedUserStatus]
    )

    const selectedHeader = useMemo(
        () => (
            <div className='flex flex-wrap justify-content-between gap-2'>
                <span>Đã chọn {selectedUsers.length} sản phẩm trên trang này</span>
                <Dropdown options={['Xóa', 'Vô hiệu']} placeholder='Chọn thao tác' />
            </div>
        ),
        [selectedUsers]
    )

    const onSelectionChange = useCallback((e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>) => {
        setSelectedUsers(e.value as User[])
    }, [])

    // Pagination
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)

        navigate({
            pathname: PATH.USER_LIST,
            search: createSearchParams({
                ...queryConfig,
                limit: event.rows.toString(),
                page: (event.page + 1).toString()
            }).toString()
        })
    }

    const totalRecords = useMemo(() => {
        return (users?.data?.pagination?.limit as number) * (users?.data?.pagination?.total_page as number)
    }, [users?.data?.pagination?.limit, users?.data?.pagination?.total_page])

    return (
        <div className='w-full'>
            <DataTable
                value={(users?.data.result as unknown as DataTableValueArray) ?? []}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey='id'
                header={selectedUsers.length > 0 ? selectedHeader : header}
                tableStyle={{ minWidth: '60rem', fontSize: '14px' }}
                selectionMode='checkbox'
                selection={selectedUsers}
                className='shadow'
                onSelectionChange={onSelectionChange}
                globalFilter={globalFilter}
            >
                <Column selectionMode='multiple' className='w-[100px]' />

                <Column className='w-[12%]' field='avatar' header='Avatar' body={avatarTemplate} />
                <Column className='w-[25%]' field='full_name' header='Họ tên' body={fullNameTemplate} />
                <Column className='' field='email' header='Email' body={emailTemplate} />
                <Column className='pl-0' field='status' header='Trạng thái' body={statusTemplate} />
                <Column className='' field='created_at' header='Ngày tham gia' body={createdAtTemplate} />
            </DataTable>
            <div className='flex justify-end mt-3'>
                <Paginator
                    style={{ backgroundColor: 'transparent', textAlign: 'right' }}
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 15]}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}
