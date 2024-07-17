import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AuthType } from '~/@types/auth'
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
import bannerLogin from '~/assets/images/bannerLogin.jpg'

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
                const result = data.data.result as AuthType
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
        <div className='flex flex-col md:flex-row  w-full min-h-[100vh]'>
            <div className='hidden md:flex w-1/2 items-center justify-center'>
                <img className='w-[600px] h-[600px] object-cover' src={bannerLogin} alt='banner' />
            </div>
            <div className='w-full md:w-1/2 bg-slate-50'>
                <div className='flex w-full h-full flex-column items-center justify-center mt-1'>
                    <form
                        onSubmit={onsubmit}
                        className='w-full md:w-2/3 surface-card py-8 px-5 sm:px-8'
                        style={{ borderRadius: '53px' }}
                    >
                        <div className='text-center mb-5'>
                            <div className='flex justify-center'></div>
                            <div className='text-900 text-3xl font-medium mb-3 capitalize'>Chào mừng, Admin!</div>
                            <span className='text-600 capitalize text-[15px]'>Đăng nhập bằng tài khoản admin</span>
                        </div>

                        <div>
                            {message && <ShowMessage detail={message} severity='warn' />}
                            <MyInput
                                register={register}
                                errors={errors}
                                name='email'
                                label='Email'
                                type='text'
                                placeholder='Nhập Email'
                                className='w-full md:w-30rem rounded-none'
                                classNameLabel='text-gray-900 text-[15px] font-medium mb-2'
                                style={{ padding: '1rem', height: '56px', borderRadius: '5px', fontSize: '14px' }}
                            />

                            <MyInputPassword
                                register={register}
                                errors={errors}
                                name='password'
                                label='Mật khẩu'
                                placeholder='Nhập Mật Khẩu'
                                className='w-full md:w-30rem'
                                style={{ padding: '1rem', height: '56px', borderRadius: '5px', fontSize: '14px' }}
                            />

                            <MyButton
                                size='small'
                                severity='info'
                                loading={loginMutation.isPending}
                                className='mt-8 text-white bg-blue-600 w-full py-4 capitalize'
                            >
                                <p className='font-semibold text-[18px]'> Đăng nhập</p>
                            </MyButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
