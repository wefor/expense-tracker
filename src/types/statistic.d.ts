export interface CategoryStat {
    category: string
    icon: string
    name: string
    amount: number
    percentage: number
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
    categoryStats: CategoryStat[]
    monthlyTrend: MonthlyData[]
}
