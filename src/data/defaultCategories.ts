import type { Category } from '@/types/category'

// Category template with translation key
export interface CategoryTemplate {
    id: string
    nameKey: string
    icon: string
    color: string
    type: 'income' | 'expense'
}

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
    // Expense categories
    {
        id: 'food',
        nameKey: 'categories.food',
        icon: '🍔',
        color: '#F97316',
        type: 'expense',
    },
    {
        id: 'transport',
        nameKey: 'categories.transport',
        icon: '🚌',
        color: '#3B82F6',
        type: 'expense',
    },
    {
        id: 'housing',
        nameKey: 'categories.housing',
        icon: '🏠',
        color: '#8B5CF6',
        type: 'expense',
    },
    {
        id: 'shopping',
        nameKey: 'categories.shopping',
        icon: '🛍️',
        color: '#EC4899',
        type: 'expense',
    },
    {
        id: 'entertainment',
        nameKey: 'categories.entertainment',
        icon: '🎮',
        color: '#EF4444',
        type: 'expense',
    },
    {
        id: 'health',
        nameKey: 'categories.health',
        icon: '💊',
        color: '#10B981',
        type: 'expense',
    },
    {
        id: 'education',
        nameKey: 'categories.education',
        icon: '📚',
        color: '#6366F1',
        type: 'expense',
    },
    {
        id: 'work',
        nameKey: 'categories.work',
        icon: '💼',
        color: '#FBBF24',
        type: 'expense',
    },
    {
        id: 'travel',
        nameKey: 'categories.travel',
        icon: '✈️',
        color: '#06B6D4',
        type: 'expense',
    },
    {
        id: 'other-expense',
        nameKey: 'categories.otherExpense',
        icon: '🏦',
        color: '#6B7280',
        type: 'expense',
    },

    // Income categories
    {
        id: 'salary',
        nameKey: 'categories.salary',
        icon: '💰',
        color: '#10B981',
        type: 'income',
    },
    {
        id: 'gift',
        nameKey: 'categories.gift',
        icon: '🎁',
        color: '#F59E0B',
        type: 'income',
    },
    {
        id: 'investment',
        nameKey: 'categories.investment',
        icon: '📈',
        color: '#3B82F6',
        type: 'income',
    },
    {
        id: 'side-income',
        nameKey: 'categories.sideIncome',
        icon: '🤝',
        color: '#8B5CF6',
        type: 'income',
    },
    {
        id: 'other-income',
        nameKey: 'categories.otherIncome',
        icon: '✨',
        color: '#6B7280',
        type: 'income',
    },
]

// Helper function to convert template to Category with translated name
export function createCategoryFromTemplate(
    template: CategoryTemplate,
    translateFn: (key: string) => string
): Category {
    return {
        id: template.id,
        name: translateFn(template.nameKey),
        icon: template.icon,
        color: template.color,
        type: template.type,
    }
}

// Legacy export for backward compatibility (uses English as default)
export const DEFAULT_CATEGORIES: Category[] = CATEGORY_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.nameKey.split('.').pop() || template.id,
    icon: template.icon,
    color: template.color,
    type: template.type,
}))
