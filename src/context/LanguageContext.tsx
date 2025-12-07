import { createContext, type ReactNode, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'en' | 'zh-TW'

export interface LanguageContextValue {
    language: Language
    changeLanguage: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(
    undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation()

    const changeLanguage = useCallback(
        (lang: Language) => {
            i18n.changeLanguage(lang)
            localStorage.setItem('expense-tracker-language', lang)
        },
        [i18n]
    )

    return (
        <LanguageContext.Provider
            value={{
                language: i18n.language as Language,
                changeLanguage,
            }}>
            {children}
        </LanguageContext.Provider>
    )
}
