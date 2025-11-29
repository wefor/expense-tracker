import type { Category } from '@/types/category'

export const DEFAULT_CATEGORIES: Category[] = [
    // Expense categories
    {
        id: 'food',
        name: 'Food',
        icon: '🍔',
        color: '#F97316',
        type: 'expense',
    },
    {
        id: 'transport',
        name: 'Transport',
        icon: '🚌',
        color: '#3B82F6',
        type: 'expense',
    },
    {
        id: 'housing',
        name: 'Housing',
        icon: '🏠',
        color: '#8B5CF6',
        type: 'expense',
    },
    {
        id: 'shopping',
        name: 'Shopping',
        icon: '🛍️',
        color: '#EC4899',
        type: 'expense',
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎮',
        color: '#EF4444',
        type: 'expense',
    },
    {
        id: 'health',
        name: 'Health',
        icon: '💊',
        color: '#10B981',
        type: 'expense',
    },
    {
        id: 'education',
        name: 'Education',
        icon: '📚',
        color: '#6366F1',
        type: 'expense',
    },
    {
        id: 'work',
        name: 'Work',
        icon: '💼',
        color: '#FBBF24',
        type: 'expense',
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: '✈️',
        color: '#06B6D4',
        type: 'expense',
    },
    {
        id: 'other-expense',
        name: 'Other Expense',
        icon: '🏦',
        color: '#6B7280',
        type: 'expense',
    },

    // Income categories
    {
        id: 'salary',
        name: 'Salary',
        icon: '💰',
        color: '#10B981',
        type: 'income',
    },
    {
        id: 'gift',
        name: 'Gift',
        icon: '🎁',
        color: '#F59E0B',
        type: 'income',
    },
    {
        id: 'investment',
        name: 'Investment',
        icon: '📈',
        color: '#3B82F6',
        type: 'income',
    },
    {
        id: 'side-income',
        name: 'Side Income',
        icon: '🤝',
        color: '#8B5CF6',
        type: 'income',
    },
    {
        id: 'other-income',
        name: 'Other Income',
        icon: '✨',
        color: '#6B7280',
        type: 'income',
    },
]
