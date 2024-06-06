import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { MessageResponse } from '~/@types/util'
import authApi from '~/apis/auth.api'
import MyButton from '~/components/MyButton'
import MyInput from '~/components/MyInput'
import MyInputPassword from '~/components/MyInputPassword'
import ShowMessage from '~/components/ShowMessage'
import MESSAGE from '~/constants/message'
import PATH from '~/constants/path'
import { ROLE } from '~/constants/util'
import { AppContext } from '~/contexts/app.context'
import { AuthSchemaType, authSchema } from '~/schemas/auth.schema'

type FormDataLogin = Pick<AuthSchemaType, 'email' | 'password'>
const loginSchema = authSchema.pick(['email', 'password'])
export default function Login() {
    const { setProfile, setIsAuthenticated } = useContext(AppContext)
    const navigate = useNavigate()
    const [message, setMessage] = useState<string>('')
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormDataLogin>({
        resolver: yupResolver(loginSchema)
    })

    const loginMutation = useMutation({
        mutationFn: (data: FormDataLogin) => authApi.login(data)
    })

    const onsubmit = handleSubmit((data) => {
        setMessage('')
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                const result = data.data.result
                if (result.user.roles[0].name !== ROLE.ADMIN) {
                    setMessage(MESSAGE.PLEASE_LOGIN_ACCOUNT_ADMIN)
                }
                setProfile(result.user)
                setIsAuthenticated(true)
                navigate(PATH.DASHBOARD)
            },
            onError: (error) => {
                const errorResponse = (error as AxiosError<MessageResponse>).response?.data
                setMessage(errorResponse?.message ?? '')
            }
        })
    })

    return (
        <div className='min-w-[520px] lg:w-[520px] flex flex-column align-items-center justify-content-center  mt-14 shadow  bg-white rounded-lg'>
            <form onSubmit={onsubmit} className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                <div className='text-center mb-5'>
                    <div className='flex justify-center'>
                        <img
                            src='https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg'
                            alt='Image'
                            height='120'
                            width='120'
                            className='mb-3'
                        />
                    </div>
                    <div className='text-900 text-3xl font-medium mb-3'>Chào mừng, Admin!</div>
                    <span className='text-600 font-medium'>Đăng nhập bằng tài khoản admin</span>
                </div>

                <div>
                    {message && <ShowMessage detail={message} severity='warn' />}
                    <MyInput
                        register={register}
                        errors={errors}
                        name='email'
                        label='Email'
                        type='text'
                        placeholder='Nhập email'
                        className='w-full md:w-30rem '
                        classNameLabel='text-gray-900 text-[18px] font-medium mb-2'
                        style={{ padding: '1rem', height: '55px', borderRadius: '6px' }}
                    />

                    <MyInputPassword
                        register={register}
                        errors={errors}
                        name='password'
                        label='Mật khẩu'
                        placeholder='Nhập mật khẩu'
                        className='w-full md:w-30rem'
                        style={{ padding: '1rem', height: '55px', borderRadius: '6px' }}
                    />

                    <MyButton
                        size='large'
                        loading={loginMutation.isPending}
                        className='mt-8 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300  w-full'
                    >
                        <p className='font-semibold text-[20px]'> Đăng nhập</p>
                    </MyButton>
                </div>
            </form>
        </div>
    )
}
