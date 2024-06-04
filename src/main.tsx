import React from 'react'
import ReactDOM from 'react-dom/client'
import 'primeicons/primeicons.css'
import { PrimeReactProvider } from 'primereact/api'
import Tailwind from 'primereact/passthrough/tailwind'
import './index.css'
import './assets/css/myStyles.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProvider } from './contexts/app.context'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
                    <AppProvider>
                        <App />
                    </AppProvider>
                </PrimeReactProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
)
