import {
    format,
    parseISO,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    startOfWeek,
    endOfWeek,
} from 'date-fns'

import { zhTW } from 'date-fns/locale'

export function formatDateISO(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, 'yyyy-MM-dd')
}

export function formatDateDisplay(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, 'yyyy年MM月dd日', { locale: zhTW })
}

export function formatMonth(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, 'MM/yyyy')
}

export function formatMonthName(date: Date | string): string {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, 'MMMM yyyy', { locale: zhTW })
}

// Get month range
export function getMonthRange(date: Date | string): {
    start: string
    end: string
} {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const start = formatDateISO(startOfMonth(parsedDate))
    const end = formatDateISO(endOfMonth(parsedDate))
    return { start, end }
}

// Get year range (January 1 to December 31)
export function getYearRange(date: Date | string): {
    start: string
    end: string
} {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const start = formatDateISO(startOfYear(parsedDate))
    const end = formatDateISO(endOfYear(parsedDate))
    return { start, end }
}

// Get week range (Monday to Sunday)
export function getWeekRange(date: Date | string): {
    start: string
    end: string
} {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const start = formatDateISO(startOfWeek(parsedDate, { weekStartsOn: 1 }))
    const end = formatDateISO(endOfWeek(parsedDate, { weekStartsOn: 1 }))
    return { start, end }
}

// Check if a date is today
export function isToday(date: Date | string): boolean {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const today = new Date()
    return (
        parsedDate.getFullYear() === today.getFullYear() &&
        parsedDate.getMonth() === today.getMonth() &&
        parsedDate.getDate() === today.getDate()
    )
}

// Check if a date is in the current month
export function isCurrentMonth(date: Date | string): boolean {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const today = new Date()
    return (
        parsedDate.getFullYear() === today.getFullYear() &&
        parsedDate.getMonth() === today.getMonth()
    )
}

// Get last N months in "MMMM yyyy" format
export function getLastMonths(months: number): string[] {
    const result: string[] = []
    const today = new Date()
    for (let i = 0; i < months; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
        result.push(formatMonth(date))
    }
    return result
}
