/**
 * Format number as currency (TWD)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format currency without symbol for display
 */
export const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('zh-TW', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
    const numericString = value.replace(/[^0-9.-]+/g, '')
    return parseFloat(numericString) || 0
}
