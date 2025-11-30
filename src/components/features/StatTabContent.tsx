import { useMemo } from 'react'
import { StatCard } from '@/components/features/StatCard'
import { formatCurrency } from '@/utils/formatCurrency'
import { calculateStatistics } from '@/utils/calculateStats'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import { useContext } from 'react'
import {
    getMonthRange,
    formatMonth,
    getLastMonths,
    getYearRange,
} from '@/utils/formatDate'

interface StatTabContentProps {
    range: 'month' | 'last-month' | 'year' | 'last-year'
}

export function StatTabContent({ range }: StatTabContentProps) {
    const transactionContext = useContext(TransactionContext)
    const categoriesContext = useContext(CategoriesContext)

    if (!transactionContext || !categoriesContext) {
        throw new Error('Required context not found')
    }

    const { transactions } = transactionContext
    const { categories } = categoriesContext

    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastYear = new Date(today.getFullYear(), 0, 1)

    const date =
        range === 'last-month'
            ? lastMonth
            : range === 'last-year'
            ? lastYear
            : today

    // Get current month or year range
    const firstRange = useMemo(() => {
        return range === 'month' || range === 'last-month'
            ? getMonthRange(date)
            : getYearRange(date)
    }, [range, date])

    // Get last month or year range
    const lastLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    const lastLastYear = new Date(date.getFullYear(), 0, 1)
    const lastLastDate =
        range === 'month' || range === 'last-month'
            ? lastLastMonth
            : lastLastYear
    const lastRange = useMemo(() => {
        return range === 'month' || range === 'last-month'
            ? getMonthRange(lastLastDate)
            : getYearRange(lastLastDate)
    }, [range, lastLastDate])

    // Get current month or year transactions
    const firstTransactions = useMemo(
        () =>
            transactions.filter(
                (t) => t.date >= firstRange.start && t.date <= firstRange.end
            ),
        [transactions, firstRange]
    )
    // Get last month or year transactions
    const lastTransactions = useMemo(
        () =>
            transactions.filter(
                (t) => t.date >= lastRange.start && t.date <= lastRange.end
            ),
        [transactions, lastRange]
    )

    const stats = useMemo(
        () =>
            calculateStatistics(
                firstTransactions,
                lastTransactions,
                categories
            ),
        [firstTransactions, lastTransactions, categories]
    )

    return (
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
                label="Total Income"
                value={formatCurrency(stats.totalIncome)}
                compare={stats.incomeCompare}
            />
            <StatCard
                label="Total Expense"
                value={formatCurrency(stats.totalExpense)}
                compare={stats.expenseCompare}
            />
            <StatCard
                label="Net Amount"
                value={formatCurrency(stats.netAmount)}
                compare={stats.netAmountCompare}
            />
        </div>
    )
}
