import { Link, useLocation } from 'react-router-dom'

interface MenuItem {
    label: string
    icon?: JSX.Element
    link?: string
    children?: MenuItem[]
}

interface RenderMenuItemsProps {
    items: MenuItem[]
    isSubmenu?: boolean
    handleToggle: (label: string) => void
    openItems: Record<string, boolean>
}

export default function MenuItem({ items, isSubmenu = false, handleToggle, openItems }: RenderMenuItemsProps) {
    const location = useLocation()

    const renderMenuItems = (items: MenuItem[], isSubmenu: boolean) => {
        return (
            <ul className={`${isSubmenu ? 'py-2 space-y-2' : 'pb-2 space-y-2'}`}>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.children ? (
                            <>
                                <button
                                    type='button'
                                    className='flex items-center w-full px-2 py-2.5 text-[14px] transition duration-75 rounded-lg group  text-white'
                                    onClick={() => handleToggle(item.label)}
                                >
                                    {item.icon}
                                    <span className='flex-1 ml-3 text-left whitespace-nowrap'>{item.label}</span>
                                    <svg
                                        className={`w-6 h-6 transition-transform ${openItems[item.label] ? 'rotate-0' : '-rotate-90'}`}
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </button>
                                {openItems[item.label] && renderMenuItems(item.children, true)}
                            </>
                        ) : (
                            <Link
                                to={item.link ?? ''}
                                className={`flex items-center px-2 py-2.5 text-[14px] transition duration-75 rounded-[4px] text-white  ${
                                    location.pathname === item.link ? 'bg-blue-600 text-blue-800' : ''
                                }`}
                                onClick={() => {}}
                            >
                                {item.icon}
                                <span className='ml-3'>{item.label}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        )
    }

    return renderMenuItems(items, isSubmenu)
}
