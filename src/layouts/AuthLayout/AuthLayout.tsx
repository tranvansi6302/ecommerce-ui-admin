interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='flex justify-center bg-slate-50 min-h-[100vh]'>
            <div className=''>{children}</div>
        </div>
    )
}
