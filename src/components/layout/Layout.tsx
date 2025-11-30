import { type ReactNode, useContext, useState, useEffect } from 'react'
import { Header } from './Header'
import { SettingsContext } from '@/context/SettingsContext'
import { Toaster } from '@/components/ui/sonner'

export function Layout({ children }: { children: ReactNode }) {
    const settingsContext = useContext(SettingsContext)

    if (!settingsContext) {
        throw new Error('SettingsContext not found')
    }
    const { settings } = settingsContext
    const [theme, setTheme] = useState(settings.theme)

    useEffect(() => {
        setTheme(settings.theme)
        document.documentElement.setAttribute('class', settings.theme)
    }, [settings.theme])
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto max-w-[960px] px-4 py-6">
                {children}
            </main>
            <Toaster />
        </div>
    )
}
