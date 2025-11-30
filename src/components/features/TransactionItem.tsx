import { useContext } from 'react'
import type { Transaction } from '@/types/transaction'
import { CategoriesContext } from '@/context/CategoriesContext'
import { formatCurrency } from '@/utils/formatCurrency'
import { Button } from '@/components/ui/button'
import { Trash2, FileText } from 'lucide-react'
import { formatDateDisplay } from '@/utils/formatDate'

interface TransactionItemProps {
    transaction: Transaction
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export function TransactionItem({
    transaction,
    onEdit,
    onDelete,
}: TransactionItemProps) {
    const categoriesContext = useContext(CategoriesContext)
    if (!categoriesContext) throw new Error('CategoriesContext not found')

    const category = categoriesContext.getCategoryById(transaction.category)
    const isIncome = transaction.type === 'income'

    return (
        <div className="flex items-center gap-4  min-h-[72px] pb-2 justify-between">
            <div className="flex items-center gap-4">
                <div
                    className="text-[#0d1b17] flex items-center justify-center rounded-lg bg-[#e7f3ef] shrink-0 size-12"
                    data-icon="ShoppingCart"
                    data-size="24px"
                    data-weight="regular">
                    {category?.icon || '📌'}
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                        <span>{transaction.description}</span>
                    </p>
                    <p className="flex flex-col text-[#4c9a80] text-sm font-normal leading-normal line-clamp-2">
                        {category?.name || 'Unknown'}
                    </p>
                </div>
            </div>
            <div className="shrink-0">
                <div className="flex items-center flex-col md:flex-row text-foreground text-base font-normal leading-normal">
                    <div className={`text-base font-normal leading-normal`}>
                        {isIncome ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex gap-2 ml-3">
                            {onEdit && (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onEdit(transaction.id)}
                                    className="text-sm font-medium hover:bg-transparent">
                                    <FileText className="text-primary" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onDelete(transaction.id)}
                                    className="text-sm font-medium hover:bg-transparent">
                                    <Trash2 className="text-destructive" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
