export interface Transaction {
    id: string
    type: 'income' | 'expense'
    category: string
    amount: number
    date: string // YYYY-MM-DD
    description: string
    createdAt: number
    updatedAt: number
}

export interface GroupedTransaction {
    date: string
    transactions: Transaction[]
}

export interface FilterOptions {
    type?: 'income' | 'expense' | 'all'
    categories?: string[]
    dateRange?: { start: string; end: string }
    amountRange?: { min: number; max: number }
    searchTerm?: string
}
