import { useContext } from 'react'
import type { Transaction } from '@/types/transaction'
import { CategoriesContext } from '@/context/CategoriesContext'
import { formatCurrency } from '@/utils/formatCurrency'
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
        <div className="flex items-center gap-4  min-h-[72px] py-2 justify-between">
            <div className="flex items-center gap-4">
                <div
                    className="text-[#0d1b17] flex items-center justify-center rounded-lg bg-[#e7f3ef] shrink-0 size-12"
                    data-icon="ShoppingCart"
                    data-size="24px"
                    data-weight="regular">
                    {category?.icon || '📌'}
                    {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24px"
                            height="24px"
                            fill="currentColor"
                            viewBox="0 0 256 256">
                            <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
                        </svg> */}
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                        {transaction.description && (
                            <span>{transaction.description}</span>
                        )}
                    </p>
                    <p className="text-[#4c9a80] text-sm font-normal leading-normal line-clamp-2">
                        {category?.name || 'Unknown'}
                    </p>
                </div>
            </div>
            <div className="shrink-0">
                <p className="text-foreground text-base font-normal leading-normal">
                    <div className={`text-base font-normal leading-normal`}>
                        {isIncome ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex gap-2">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(transaction.id)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    編輯
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(transaction.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium">
                                    刪除
                                </button>
                            )}
                        </div>
                    )}
                </p>
            </div>
        </div>
    )
}
