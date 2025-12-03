import { useMemo } from 'react'
import { StatCard } from '@/components/features/StatCard'
import { formatCurrency } from '@/utils/formatCurrency'
import { calculateStatistics } from '@/utils/calculateStats'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import { useContext } from 'react'
import { getMonthRange, getYearRange } from '@/utils/formatDate'
import { StatChart } from '@/components/features/StatChart'
import { CategoryChart } from '@/components/features/CategoryChart'
import { calculateMonthlyTrend } from '@/utils/calculateStats'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

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

    const spendingTrendData = useMemo(
        () => calculateMonthlyTrend(transactions, 6),
        [transactions]
    )

    return (
        <>
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
            <div className="pb-3 pt-5">
                <h2 className="text-xl font-bold mb-4">Expenses Overview</h2>
                <div className="flex flex-wrap gap-4 px-0 py-6">
                    <StatChart
                        title="Monthly Spending Trend"
                        value={formatCurrency(stats.totalExpense)}
                        compare={stats.expenseCompare}
                        data={spendingTrendData}
                    />
                    <CategoryChart
                        title="Expenses by Category"
                        data={stats.categoryStats}
                    />
                </div>
            </div>
            <div className="pb-3 pt-5">
                <h2 className="text-xl font-bold mb-4">Category Details</h2>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Transactions</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">
                                    % of Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.categoryStats.length > 0 ? (
                                stats.categoryStats.map((stat) => (
                                    <TableRow key={stat.category}>
                                        <TableCell className="font-medium py-5">
                                            {stat.icon} {stat.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {stat.count}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatCurrency(stat.amount)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {stat.percentage}%
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
