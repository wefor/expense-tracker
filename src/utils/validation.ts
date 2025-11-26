/**
 * Validate if value is a valid amount (positive number)
 */
export const isValidAmount = (amount: unknown): boolean => {
    const num = Number(amount)
    return !isNaN(num) && num >= 0
}

/**
 * Validate if value is a valid date string (YYYY-MM-DD)
 */
export const isValidDate = (dateStr: unknown): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (typeof dateStr !== 'string' || !regex.test(dateStr)) {
        return false
    }

    const date = new Date(dateStr)
    return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validate transaction form data
 */
export interface TransactionFormData {
    amount?: unknown
    category?: unknown
    date?: unknown
    description?: unknown
    type?: unknown
}

export const validateTransactionForm = (
    data: TransactionFormData
): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // Validate amount
    if (!data.amount) {
        errors.amount = '請輸入金額'
    } else if (!isValidAmount(data.amount)) {
        errors.amount = '金額必須為正數'
    }

    // Validate category
    if (!data.category) {
        errors.category = '請選擇分類'
    }

    // Validate date
    if (!data.date) {
        errors.date = '請選擇日期'
    } else if (typeof data.date !== 'string' || !isValidDate(data.date)) {
        errors.date = '無效的日期格式'
    }

    // Validate type
    if (!data.type || (data.type !== 'income' && data.type !== 'expense')) {
        errors.type = '請選擇收入或支出'
    }

    // Description is optional but should be a string if provided
    if (data.description && typeof data.description !== 'string') {
        errors.description = '備註必須為文字'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate and sanitize search term
 */
export function sanitizeSearchTerm(term: string): string {
    return term.trim().toLowerCase()
}

/**
 * Check if amount is within range
 */
export function isWithinAmountRange(
    amount: number,
    min?: number,
    max?: number
): boolean {
    if (min !== undefined && amount < min) return false
    if (max !== undefined && amount > max) return false
    return true
}

/**
 * Check if date is within range
 */
export function isWithinDateRange(
    date: string,
    startDate?: string,
    endDate?: string
): boolean {
    if (startDate && date < startDate) return false
    if (endDate && date > endDate) return false
    return true
}
