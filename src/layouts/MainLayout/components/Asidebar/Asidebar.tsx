import { useState } from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { BsBox } from 'react-icons/bs'
import { LuLayoutDashboard } from 'react-icons/lu'
import { RiTShirt2Line } from 'react-icons/ri'
import { GrMoney } from 'react-icons/gr'
import PATH from '~/constants/path'
import MenuItem from './components/MenuItem'

interface MenuItem {
    label: string
    icon?: JSX.Element
    link?: string
    children?: MenuItem[]
}

const menuItems: MenuItem[] = [
    {
        label: 'Tổng quan',
        icon: <LuLayoutDashboard fontSize='18px' />,
        link: PATH.DASHBOARD
    },
    {
        label: 'Quản lý người dùng',
        icon: <HiOutlineUserGroup fontSize='18px' />,
        children: [
            {
                label: 'Khách hàng',
                link: PATH.USER_LIST
            }
        ]
    },
    {
        label: 'Quản lý Sản phẩm',
        icon: <RiTShirt2Line fontSize='18px' />,
        children: [
            {
                label: 'Sản phẩm',
                link: PATH.PRODUCT_LIST
            },
            {
                label: 'Loại sản phẩm',
                link: PATH.CATEGORY_LIST
            },
            {
                label: 'Thương hiệu',
                link: PATH.BRAND_LIST
            }
        ]
    },
    {
        label: 'Quản lý kho',
        icon: <BsBox fontSize='18px' />,
        children: [
            {
                label: 'Nhà cung cấp',
                link: PATH.SUPPLIER_LIST
            },
            {
                label: 'Đơn nhập hàng',
                link: PATH.PURCHASE_LIST
            },
            {
                label: 'Tồn kho',
                link: PATH.WAREHOURSE_LIST
            }
        ]
    },
    {
        label: 'Quản lý giá bán',
        icon: <GrMoney fontSize='18px' />,
        children: [
            {
                label: 'Bảng giá',
                link: PATH.PRICE_PLAN_LIST
            },
            {
                label: 'Lịch sử thay đổi',
                link: PATH.PRICE_PLAN_LIST_HISTORY
            }
        ]
    }
]

export default function Asidebar() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

    const handleToggle = (label: string) => {
        setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }))
    }

    return (
        <aside id='sidebar' className='fixed top-0 left-0 z-20 flex-col w-64 h-full bg-[#182537]' aria-label='Sidebar'>
            <a href='https://flowbite-admin-dashboard.vercel.app/' className='flex ml-2 md:mr-24 pt-5 pl-2'>
                <img src='https://flowbite-admin-dashboard.vercel.app/images/logo.svg' className='h-8 mr-3' alt='FlowBite Logo' />
                <span className='self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white'>Admin</span>
            </a>
            <div className='relative flex flex-col flex-1 min-h-0'>
                <div className='flex flex-col flex-1 pt-5 pb-4 overflow-y-auto'>
                    <div className='flex-1 px-3 space-y-1 divide-y divide-gray-200'>
                        <MenuItem items={menuItems} handleToggle={handleToggle} openItems={openItems} />
                    </div>
                </div>
            </div>
        </aside>
    )
}
