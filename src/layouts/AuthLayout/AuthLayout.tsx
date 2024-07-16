interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='w-full'>
            <div>{children}</div>
        </div>
    )
}
