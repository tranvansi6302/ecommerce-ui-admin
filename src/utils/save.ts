import { User } from '~/@types/user'

export const saveTokenToLS = (token: string) => {
    localStorage.setItem('token', token)
}
export const getTokenFromLS = () => {
    return localStorage.getItem('token') || ''
}

export const clearTokenFromLS = () => {
    localStorage.removeItem('token')
}

export const saveProfileToLS = (profile: User) => {
    localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileFromLS = () => {
    const profile = localStorage.getItem('profile')
    if (profile) {
        return JSON.parse(profile)
    }
    return null
}

export const clearProfileFromLS = () => {
    localStorage.removeItem('profile')
}
