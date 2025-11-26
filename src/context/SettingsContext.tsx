/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useCallback } from 'react'
import type { Settings } from '@/types/settings'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface SettingsContextValue {
    settings: Settings
    updateSettings: (settings: Partial<Settings>) => void
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(
    undefined
)

interface SettingsProviderProps {
    children: ReactNode
}

const STORAGE_KEY = 'expense-tracker-settings'

const DEFAULT_SETTINGS: Settings = {
    theme: 'light',
    currency: 'TWD',
    dateFormat: 'yyyy-MM-dd',
}

export function SettingsProvider({ children }: SettingsProviderProps) {
    const [settings, setSettings] = useLocalStorage<Settings>(
        STORAGE_KEY,
        DEFAULT_SETTINGS
    )

    const updateSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            setSettings((prevSettings) => ({
                ...prevSettings,
                ...newSettings,
            }))
        },
        [setSettings]
    )

    const value: SettingsContextValue = {
        settings,
        updateSettings,
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
