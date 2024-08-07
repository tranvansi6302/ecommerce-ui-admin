import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { clearProfileFromLS, clearTokenFromLS } from '~/utils/save'

export default function Header() {
    const { title, setIsAuthenticated } = useContext(AppContext)
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const navigate = useNavigate()
    const items: MenuItem[] = [
        { label: 'Tài khoản của tôi', icon: 'pi pi-user', command: () => setOpenMenu(false) },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-out',
            command: () => {
                setOpenMenu(false)
                setIsAuthenticated(false)
                clearTokenFromLS()
                clearProfileFromLS()
                navigate(PATH.LOGIN)
                toast.success(MESSAGE.LOGOUT_SUCCESS)
            }
        }
    ]

    return (
        <nav className='w-full bg-white border-b shadow-sm'>
            <div className='px-3 py-3 lg:px-5 lg:pl-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center justify-start'>
                        <div className='hidden lg:block lg:pl-6'>
                            <h2 className='text-[24px] font-semibold'>{title}</h2>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className='mr-3 -mb-1 sm:block relative'>
                            <div className='card flex justify-content-center cursor-pointer'>
                                <Avatar
                                    className='bg-green-600 text-white'
                                    onClick={() => setOpenMenu(!openMenu)}
                                    label='S'
                                    size='large'
                                    shape='circle'
                                />
                            </div>
                            {openMenu && (
                                <div className='absolute right-0 mt-2' style={{ zIndex: 99999 }}>
                                    <Menu model={items} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
