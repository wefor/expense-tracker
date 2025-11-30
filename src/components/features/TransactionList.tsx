import { Fragment } from 'react'
import type { GroupedTransaction } from '@/types/transaction'
import { TransactionItem } from './TransactionItem'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { formatDateDisplay } from '@/utils/formatDate'
import { Plus } from 'lucide-react'

interface TransactionListProps {
    transactions: GroupedTransaction[]
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onAddNew?: () => void
}

export function TransactionList({
    transactions,
    onEdit,
    onDelete,
    onAddNew,
}: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <EmptyState
                icon="🙊"
                title="No transaction"
                description="Start your first transaction"
                action={
                    onAddNew && (
                        <Button onClick={onAddNew}>
                            <Plus /> Add New Transaction
                        </Button>
                    )
                }
            />
        )
    }
    return (
        <div className="space-y-3">
            {transactions.map((groupedTransaction) => (
                <Fragment key={groupedTransaction.date}>
                    <p className="text-base font-normal leading-normal flex-1 truncate">
                        {formatDateDisplay(groupedTransaction.date)}
                    </p>
                    {groupedTransaction.transactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    )
}
