import { useState } from 'react'
import { BsBox } from 'react-icons/bs'
import { LuLayoutDashboard } from 'react-icons/lu'
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
        label: 'Sản phẩm',
        icon: <BsBox fontSize='18px' />,
        children: [
            {
                label: 'Danh sách sản phẩm',
                link: PATH.PRODUCT_LIST
            },
            {
                label: 'Danh sách loại sản phẩm',
                link: PATH.CATEGORY_LIST
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
