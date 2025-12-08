/* eslint-disable react-refresh/only-export-components */
import type { Category } from '@/types/category'
import { createContext, useCallback, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useCategories } from '@/hooks/useCategories'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CATEGORY_TEMPLATES, createCategoryFromTemplate } from '@/data/defaultCategories'
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

const CUSTOM_CATEGORIES_KEY = 'expense-tracker-custom-categories'

export function CategoriesProvider({ children }: CategoriesProviderProps) {
    const { t } = useTranslation()

    // Store only custom categories (non-default ones)
    const [customCategories, setCustomCategories] = useLocalStorage<Category[]>(
        CUSTOM_CATEGORIES_KEY,
        []
    )

    // Generate default categories with current language
    const defaultCategories = useMemo(
        () => CATEGORY_TEMPLATES.map(template => createCategoryFromTemplate(template, t)),
        [t]
    )

    // Combine default and custom categories
    const categories = useMemo(
        () => [...defaultCategories, ...customCategories],
        [defaultCategories, customCategories]
    )

    const categoryHooks = useCategories(categories)

    const addCategory = useCallback(
        (category: Omit<Category, 'id'>) => {
            const newCategory: Category = {
                ...category,
                id: generateId(),
            }
            setCustomCategories((prev) => [...prev, newCategory])
        },
        [setCustomCategories]
    )

    const updateCategory = useCallback(
        (id: string, updates: Partial<Category>) => {
            // Check if it's a default category (cannot be updated)
            const isDefaultCategory = CATEGORY_TEMPLATES.some(template => template.id === id)
            if (isDefaultCategory) {
                toast.error(t('settings.cannotUpdateDefaultCategory'))
                return
            }

            setCustomCategories((prev) =>
                prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
            )
        },
        [setCustomCategories, t]
    )

    const deleteCategory = useCallback(
        (id: string) => {
            // Check if it's a default category (cannot be deleted)
            const isDefaultCategory = CATEGORY_TEMPLATES.some(template => template.id === id)
            if (isDefaultCategory) {
                toast.error(t('settings.cannotDeleteDefaultCategory'))
                return
            }

            setCustomCategories((prev) => prev.filter((cat) => cat.id !== id))
        },
        [setCustomCategories, t]
    )

    const resetToDefault = useCallback(() => {
        setCustomCategories([])
    }, [setCustomCategories])

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
