import type {
    StatisticData,
    CategoryStat,
    MonthlyData,
} from '@/types/statistic'
import type { Transaction } from '@/types/transaction'
import type { Category } from '@/types/category'

import { formatMonth, formatDateISO, getLastMonths } from './formatDate'

/**
 * Calculate total income from transactions
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Calculate total expense from transactions
 */
export function calculateTotalExpense(transactions: Transaction[]): number {
    return transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Calculate net amount (income - expense)
 */
export function calculateNetAmount(transactions: Transaction[]): number {
    const totalIncome = calculateTotalIncome(transactions)
    const totalExpense = calculateTotalExpense(transactions)
    return totalIncome - totalExpense
}

/**
 * Get today's expense
 */
export function getTodayExpense(transactions: Transaction[]): number {
    const todayStr = formatDateISO(new Date())
    return transactions
        .filter((tx) => tx.type === 'expense' && tx.date.startsWith(todayStr))
        .reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Calculate statistics by category
 */
export function calculateCategoryStats(
    transactions: Transaction[],
    categories: Category[]
): CategoryStat[] {
    const expenses = transactions.filter((tx) => tx.type === 'expense')
    const totalExpense = calculateTotalExpense(transactions)

    const stats = expenses.reduce((acc, transaction) => {
        const category = categories.find(
            (cat) => cat.id === transaction.category
        )
        if (!category) return acc

        const existingStat = acc.find((stat) => stat.category === category.id)
        if (existingStat) {
            existingStat.amount += transaction.amount
            existingStat.count += 1
        } else {
            acc.push({
                category: transaction.category,
                name: category.name,
                icon: category.icon,
                amount: transaction.amount,
                percentage: 0, // to be calculated later
                count: 1,
            })
        }

        return acc
    }, [] as CategoryStat[])

    // Calculate percentages
    return stats
        .map((stat) => ({
            ...stat,
            percentage:
                totalExpense > 0
                    ? Math.round((stat.amount / totalExpense) * 100)
                    : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
}

/**
 * Calculate monthly spending trend data
 */
export function calculateMonthlyTrend(
    transactions: Transaction[],
    monthsToShow: number = 6
): MonthlyData[] {
    const monthStrings = getLastMonths(monthsToShow).reverse()

    return monthStrings.map((monthStr) => {
        const monthTransactions = transactions.filter((t) => {
            const tMonth = formatMonth(t.date)
            return tMonth === monthStr
        })

        return {
            month: monthStr,
            income: calculateTotalIncome(monthTransactions),
            expense: calculateTotalExpense(monthTransactions),
        }
    })
}

// Calculate percentage change
const calculateChange = (currentAmount: number, lastAmount: number): number => {
    if (lastAmount === 0) {
        return currentAmount > 0 ? 100 : 0
    }

    const percentageChange = ((currentAmount - lastAmount) / lastAmount) * 100

    return Math.round(percentageChange * 100) / 100
}

/**
 * Calculate statistics for a transaction list
 */
export function calculateStatistics(
    transactions: Transaction[],
    lastTransactions: Transaction[],
    categories: Category[]
): StatisticData {
    const totalIncome = calculateTotalIncome(transactions)
    const totalExpense = calculateTotalExpense(transactions)
    const netAmount = calculateNetAmount(transactions)
    const todayExpense = getTodayExpense(transactions)

    const lastTotalIncome = calculateTotalIncome(lastTransactions)
    const lastTotalExpense = calculateTotalExpense(lastTransactions)
    const lastNetAmount = calculateNetAmount(lastTransactions)
    const lastTodayExpense = getTodayExpense(lastTransactions)

    const incomeCompare = calculateChange(totalIncome, lastTotalIncome)
    const expenseCompare = calculateChange(totalExpense, lastTotalExpense)
    const netAmountCompare = calculateChange(netAmount, lastNetAmount)
    const todayExpenseCompare = calculateChange(todayExpense, lastTodayExpense)

    return {
        totalIncome,
        totalExpense,
        netAmount,
        todayExpense,
        incomeCompare,
        expenseCompare,
        netAmountCompare,
        todayExpenseCompare,
        categoryStats: calculateCategoryStats(transactions, categories),
        monthlyTrend: calculateMonthlyTrend(transactions),
    }
}

/**
 * Get statistics for current month
 */
export function getCurrentMonthStats(
    transactions: Transaction[],
    categories: Category[]
): StatisticData {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthTransactions = transactions.filter((tx) => {
        const date = new Date(tx.date)
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        )
    })

    return calculateStatistics(monthTransactions, [], categories)
}

/**
 * Calculate average daily spending
 */
export function calculateAverageDailySpending(
    transactions: Transaction[]
): number {
    const expenses = transactions.filter((t) => t.type === 'expense')
    if (expenses.length === 0) return 0

    const totalExpense = calculateTotalExpense(expenses)
    const days = new Set(expenses.map((t) => t.date)).size

    return days > 0 ? Math.round(totalExpense / days) : 0
}
