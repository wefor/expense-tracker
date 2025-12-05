import { useCallback } from 'react'
import type { Transaction, FilterOptions } from '../types/transaction'
import {
    isValidAmount,
    isValidDate,
    isWithinAmountRange,
    isWithinDateRange,
    sanitizeSearchTerm,
    generateId,
} from '@/utils/validation'

/**
 * Custom hook for transaction operations
 */
export function useTransactions(transactions: Transaction[]) {
    /**
     * Add a new transaction
     */
    const addTransaction = useCallback(
        (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
            if (!isValidAmount(transaction.amount)) {
                throw new Error('Invalid amount')
            }
            if (!isValidDate(transaction.date)) {
                throw new Error('Invalid date')
            }

            return {
                ...transaction,
                id: generateId(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            } as Transaction
        },
        []
    )

    /**
     * Update a transaction
     */
    const updateTransaction = useCallback(
        (id: string, updates: Partial<Transaction>) => {
            if (updates.amount && !isValidAmount(updates.amount)) {
                throw new Error('Invalid amount')
            }
            if (updates.date && !isValidDate(updates.date)) {
                throw new Error('Invalid date')
            }

            return {
                ...updates,
                id,
                updatedAt: Date.now(),
            }
        },
        []
    )

    /**
     * Filter transactions by criteria
     */
    const filterTransactions = useCallback(
        (filters: FilterOptions): Transaction[] => {
            let result = [...transactions]
            // Filter by date range
            if (filters.dateRange?.start && filters.dateRange?.end) {
                result = result.filter((t) =>
                    isWithinDateRange(
                        t.date,
                        filters.dateRange!.start,
                        filters.dateRange!.end
                    )
                )
            }

            // Filter by categories
            if (filters.categories && filters.categories.length > 0) {
                result = result.filter((t) =>
                    filters.categories!.includes(t.category)
                )
            }

            // Filter by amount range
            if (filters.amountRange && filters.amountRange.max > 0) {
                result = result.filter((t) =>
                    isWithinAmountRange(
                        t.amount,
                        filters.amountRange!.min,
                        filters.amountRange!.max
                    )
                )
            }

            // Filter by type
            if (filters.type && filters.type !== 'all') {
                result = result.filter((t) => t.type === filters.type)
            }

            // Search in description
            if (filters.searchTerm) {
                const term = sanitizeSearchTerm(filters.searchTerm)
                result = result.filter((t) =>
                    sanitizeSearchTerm(t.description).includes(term)
                )
            }

            return result
        },
        [transactions]
    )

    /**
     * Sort transactions by date (newest first)
     */
    const sortByDate = useCallback(
        (txns: Transaction[], ascending = false): Transaction[] => {
            return [...txns].sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date)
                return ascending ? -dateCompare : dateCompare
            })
        },
        []
    )

    /**
     * Get transactions for a specific date
     */
    const getTransactionsByDate = useCallback(
        (date: string): Transaction[] => {
            return transactions.filter((t) => t.date === date)
        },
        [transactions]
    )

    /**
     * Get transactions for a date range
     */
    const getTransactionsByDateRange = useCallback(
        (startDate: string, endDate: string): Transaction[] => {
            return transactions.filter((t) =>
                isWithinDateRange(t.date, startDate, endDate)
            )
        },
        [transactions]
    )

    /**
     * Get transactions by category
     */
    const getTransactionsByCategory = useCallback(
        (categoryId: string): Transaction[] => {
            return transactions.filter((t) => t.category === categoryId)
        },
        [transactions]
    )

    return {
        addTransaction,
        updateTransaction,
        filterTransactions,
        sortByDate,
        getTransactionsByDate,
        getTransactionsByDateRange,
        getTransactionsByCategory,
    }
}
