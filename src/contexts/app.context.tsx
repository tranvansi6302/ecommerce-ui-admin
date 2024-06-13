import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { User } from '~/@types/user'

import { getProfileFromLS, getTokenFromLS } from '~/utils/save'

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>
    profile: User | null
    setProfile: Dispatch<SetStateAction<User | null>>
    title: string
    setTitle: Dispatch<SetStateAction<string>>
}

const initAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getTokenFromLS()),
    setIsAuthenticated: () => {},
    profile: getProfileFromLS(),
    setProfile: () => {},
    title: 'Admin',
    setTitle: () => {}
}
export const AppContext = createContext<AppContextInterface>(initAppContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initAppContext.isAuthenticated)
    const [profile, setProfile] = useState<User | null>(initAppContext.profile)
    const [title, setTitle] = useState<string>(initAppContext.title)
    return (
        <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, title, setTitle }}>
            {children}
        </AppContext.Provider>
    )
}
