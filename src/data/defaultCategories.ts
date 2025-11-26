import type { Category } from '@/types/category'

export const DEFAULT_CATEGORIES: Category[] = [
    // Expense categories
    {
        id: 'food',
        name: '餐飲',
        icon: '🍔',
        color: '#F97316',
        type: 'expense',
    },
    {
        id: 'transport',
        name: '交通',
        icon: '🚌',
        color: '#3B82F6',
        type: 'expense',
    },
    {
        id: 'housing',
        name: '居住',
        icon: '🏠',
        color: '#8B5CF6',
        type: 'expense',
    },
    {
        id: 'shopping',
        name: '購物',
        icon: '🛍️',
        color: '#EC4899',
        type: 'expense',
    },
    {
        id: 'entertainment',
        name: '娛樂',
        icon: '🎮',
        color: '#EF4444',
        type: 'expense',
    },
    {
        id: 'health',
        name: '健康',
        icon: '💊',
        color: '#10B981',
        type: 'expense',
    },
    {
        id: 'education',
        name: '教育',
        icon: '📚',
        color: '#6366F1',
        type: 'expense',
    },
    {
        id: 'work',
        name: '工作',
        icon: '💼',
        color: '#FBBF24',
        type: 'expense',
    },
    {
        id: 'travel',
        name: '旅遊',
        icon: '✈️',
        color: '#06B6D4',
        type: 'expense',
    },
    {
        id: 'other-expense',
        name: '其他',
        icon: '🏦',
        color: '#6B7280',
        type: 'expense',
    },

    // Income categories
    {
        id: 'salary',
        name: '薪資',
        icon: '💰',
        color: '#10B981',
        type: 'income',
    },
    {
        id: 'gift',
        name: '禮物',
        icon: '🎁',
        color: '#F59E0B',
        type: 'income',
    },
    {
        id: 'investment',
        name: '投資',
        icon: '📈',
        color: '#3B82F6',
        type: 'income',
    },
    {
        id: 'side-income',
        name: '副業',
        icon: '🤝',
        color: '#8B5CF6',
        type: 'income',
    },
    {
        id: 'other-income',
        name: '其他',
        icon: '✨',
        color: '#6B7280',
        type: 'income',
    },
]
