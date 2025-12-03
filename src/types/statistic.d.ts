export interface CategoryStat {
    category: string
    icon: string
    name: string
    amount: number
    percentage: number
    count: number
}

export interface MonthlyData {
    month: string
    income: number
    expense: number
}

export interface StatisticData {
    totalIncome: number
    totalExpense: number
    netAmount: number
    todayExpense: number
    incomeCompare: number
    expenseCompare: number
    netAmountCompare: number
    todayExpenseCompare: number
    categoryStats: CategoryStat[]
    monthlyTrend: MonthlyData[]
}
