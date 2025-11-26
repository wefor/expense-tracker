import type { Category } from '@/types/category'
import { createContext, useMemo, type ReactNode } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories'

export interface CategoriesContextValue {
    categories: Category[]
    getCategoryById: (id: string) => Category | undefined
    getCategoriesByType: (type: 'income' | 'expense') => Category[]
    getCategoryDisplay: (categoryId: string) => string
    getCategoryColor: (categoryId: string) => string
}

export const CategoriesContext = createContext<
    CategoriesContextValue | undefined
>(undefined)

interface CategoriesProviderProps {
    children: ReactNode
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
    const categories = useMemo(() => DEFAULT_CATEGORIES, [])
    const categoryHooks = useCategories(categories)

    const value: CategoriesContextValue = {
        categories,
        getCategoryById: categoryHooks.getCategoryById,
        getCategoriesByType: categoryHooks.getCategoriesByType,
        getCategoryDisplay: categoryHooks.getCategoryDisplay,
        getCategoryColor: categoryHooks.getCategoryColor,
    }

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    )
}
