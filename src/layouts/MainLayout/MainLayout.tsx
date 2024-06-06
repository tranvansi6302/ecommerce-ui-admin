import Asidebar from './components/Asidebar'
import Header from './components/Header'

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className='flex h-full'>
            <div className='w-1/5'>
                <Asidebar />
            </div>
            <div className='w-full'>
                <Header />
                <div className='flex-grow overflow-y-auto p-4 bg-gray-100 min-h-[100vh]'>{children}</div>
            </div>
        </div>
    )
}
