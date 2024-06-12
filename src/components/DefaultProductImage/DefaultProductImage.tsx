interface DefaultProductImageProps {
    className?: string
    height?: string
}
export default function DefaultProductImage({ className, height = '35px' }: DefaultProductImageProps) {
    return (
        <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            style={{ color: 'rgb(216, 216, 216)', height: height }}
        >
            <path
                d='M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2ZM5 19V5h14l.002 14H5Z'
                fill='currentColor'
            />
            <path d='m10 14-1-1-3 4h12l-5-7-3 4ZM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' fill='currentColor' />
        </svg>
    )
}
