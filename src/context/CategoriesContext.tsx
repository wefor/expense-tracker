/* eslint-disable react-refresh/only-export-components */
import type { Category } from '@/types/category'
import { createContext, useCallback, type ReactNode } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories'
import { generateId } from '@/utils/validation'

export interface CategoriesContextValue {
    categories: Category[]
    getCategoryById: (id: string) => Category | undefined
    getCategoriesByType: (type: 'income' | 'expense') => Category[]
    getCategoryDisplay: (categoryId: string) => string
    getCategoryColor: (categoryId: string) => string
    addCategory: (category: Omit<Category, 'id'>) => void
    updateCategory: (id: string, updates: Partial<Category>) => void
    deleteCategory: (id: string) => void
    resetToDefault: () => void
}

export const CategoriesContext = createContext<
    CategoriesContextValue | undefined
>(undefined)

interface CategoriesProviderProps {
    children: ReactNode
}

const STORAGE_KEY = 'expense-tracker-categories'

export function CategoriesProvider({ children }: CategoriesProviderProps) {
    const [categories, setCategories] = useLocalStorage<Category[]>(
        STORAGE_KEY,
        DEFAULT_CATEGORIES
    )

    const categoryHooks = useCategories(categories)

    const addCategory = useCallback(
        (category: Omit<Category, 'id'>) => {
            const newCategory: Category = {
                ...category,
                id: generateId(),
            }
            setCategories((prev) => [...prev, newCategory])
        },
        [setCategories]
    )

    const updateCategory = useCallback(
        (id: string, updates: Partial<Category>) => {
            setCategories((prev) =>
                prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
            )
        },
        [setCategories]
    )

    const deleteCategory = useCallback(
        (id: string) => {
            setCategories((prev) => prev.filter((cat) => cat.id !== id))
        },
        [setCategories]
    )

    const resetToDefault = useCallback(() => {
        setCategories(DEFAULT_CATEGORIES)
    }, [setCategories])

    const value: CategoriesContextValue = {
        categories,
        getCategoryById: categoryHooks.getCategoryById,
        getCategoriesByType: categoryHooks.getCategoriesByType,
        getCategoryDisplay: categoryHooks.getCategoryDisplay,
        getCategoryColor: categoryHooks.getCategoryColor,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefault,
    }

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    )
}
