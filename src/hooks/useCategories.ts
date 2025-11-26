import { useCallback } from 'react'
import type { Category } from '@/types/category'

export function useCategories(categories: Category[]) {
    const getCategoryById = useCallback(
        (id: string): Category | undefined =>
            categories.find((cat) => cat.id === id),
        [categories]
    )

    const getCategoriesByType = useCallback(
        (type: 'income' | 'expense'): Category[] =>
            categories.filter((cat) => cat.type === type),
        [categories]
    )

    const getCategoryByName = useCallback(
        (name: string): Category | undefined =>
            categories.find(
                (cat) => cat.name.toLowerCase() === name.toLowerCase()
            ),
        [categories]
    )

    const getExpenseCategories = useCallback(
        (): Category[] => getCategoriesByType('expense'),
        [getCategoriesByType]
    )

    const getIncomeCategories = useCallback(
        (): Category[] => getCategoriesByType('income'),
        [getCategoriesByType]
    )

    const getCategoryDisplay = useCallback(
        (id: string): string => {
            const category = getCategoryById(id)
            return category ? `${category.icon} ${category.name}` : 'Unknown'
        },
        [getCategoryById]
    )

    const getCategoryColor = useCallback(
        (id: string): string => {
            const category = getCategoryById(id)
            return category?.color || '#6B7280'
        },
        [getCategoryById]
    )

    return {
        getCategoryById,
        getCategoriesByType,
        getCategoryByName,
        getExpenseCategories,
        getIncomeCategories,
        getCategoryDisplay,
        getCategoryColor,
    }
}
