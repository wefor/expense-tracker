import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Category } from '@/types/category'
import { useTranslation } from 'react-i18next'

interface CategoryCardProps {
    category: Category
    onEdit: (category: Category) => void
    onDelete: (id: string) => void
    isDefault?: boolean
}

export function CategoryCard({
    category,
    onEdit,
    onDelete,
    isDefault,
}: CategoryCardProps) {
    const { t } = useTranslation()

    return (
        <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-lg text-2xl"
                        style={{ backgroundColor: category.color + '20' }}>
                        {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-medium truncate"
                            style={{ color: category.color }}>
                            {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {category.type === 'income'
                                ? t('settings.income')
                                : t('settings.expense')}
                            {isDefault && ` • ${t('settings.default')}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(category)}
                        className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    {!isDefault && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(category.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
