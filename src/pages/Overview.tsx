import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import { StatCard } from '@/components/features/StatCard'
import { TransactionItem } from '@/components/features/TransactionItem'
import { CategoryExpenditure } from '@/components/features/CategoryExpenditure'
import { formatCurrency } from '@/utils/formatCurrency'
import { calculateStatistics } from '@/utils/calculateStats'
import { getMonthRange, formatMonth } from '@/utils/formatDate'

export function Overview() {
    const { t } = useTranslation()
    const transactionContext = useContext(TransactionContext)
    const categoriesContext = useContext(CategoriesContext)

    if (!transactionContext || !categoriesContext) {
        throw new Error('Required context not found')
    }

    const { transactions } = transactionContext
    const { categories } = categoriesContext

    // Memoize date calculations to ensure stable references
    const today = useMemo(() => new Date(), [])
    const lastMonth = useMemo(
        () => new Date(today.getFullYear(), today.getMonth() - 1, 1),
        [today]
    )

    // Get current month range
    const monthRange = useMemo(() => getMonthRange(today), [today])
    // Get last month range
    const lastMonthRange = useMemo(() => getMonthRange(lastMonth), [lastMonth])

    // Get current month stats
    const monthTransactions = useMemo(
        () =>
            transactions.filter(
                (t) => t.date >= monthRange.start && t.date <= monthRange.end
            ),
        [transactions, monthRange]
    )
    // Get last month stats
    const lastMonthTransactions = useMemo(
        () =>
            transactions.filter(
                (t) =>
                    t.date >= lastMonthRange.start &&
                    t.date <= lastMonthRange.end
            ),
        [transactions, lastMonthRange]
    )

    const stats = useMemo(
        () =>
            calculateStatistics(
                monthTransactions,
                lastMonthTransactions,
                categories
            ),
        [monthTransactions, lastMonthTransactions, categories]
    )

    // Get recent transactions
    const recentTransactions = useMemo(
        () =>
            [...transactions]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10),
        [transactions]
    )

    const monthStr = formatMonth(new Date())
    return (
        <div className="p-4">
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    {t('overview.title')}
                    <span className="mx-3 text-lg">{monthStr}</span>
                </h1>
            </div>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label={t('overview.thisMonthExpense')}
                    value={formatCurrency(stats.totalExpense)}
                    compare={stats.expenseCompare}
                />
                <StatCard
                    label={t('overview.thisMonthIncome')}
                    value={formatCurrency(stats.totalIncome)}
                    compare={stats.incomeCompare}
                />
                <StatCard
                    label={t('overview.currentBalance')}
                    value={formatCurrency(stats.netAmount)}
                    compare={stats.netAmountCompare}
                />
                <StatCard
                    label={t('overview.todaysSpending')}
                    value={formatCurrency(stats.todayExpense)}
                    compare={stats.todayExpenseCompare}
                />
            </div>

            {/* Top Categories */}
            <div className="mt-5 p-2">
                <h2 className="text-xl font-bold mb-4">
                    {t('analytics.topCategories')}
                </h2>
                {stats.categoryStats.length > 0 ? (
                    <div className="space-y-3">
                        {stats.categoryStats.slice(0, 5).map((stat) => (
                            <CategoryExpenditure
                                key={stat.category}
                                stat={stat}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {t('analytics.noData')}
                    </p>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="mt-5 p-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{t('overview.recentTransactions')}</h2>
                    <Link
                        to="/transactions"
                        className="text-sm underline text-muted-foreground">
                        {t('overview.viewAll')}
                    </Link>
                </div>
                <div className="space-y-1">
                    {recentTransactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))}
                </div>
                {recentTransactions.length === 0 && (
                    <p className="text-gray-500 text-left py-8">
                        {t('overview.noTransactions')}
                    </p>
                )}
            </div>
        </div>
    )
}
