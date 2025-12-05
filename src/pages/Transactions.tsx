import { useContext, useState, useEffect, useMemo } from 'react'
import { TransactionContext } from '@/context/TransactionContext'
import { TransactionList } from '@/components/features/TransactionList'
import { TransactionForm } from '@/components/features/TransactionForm'
import { Filters } from '@/components/features/Filters'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { PaginationWithSelect } from '@/components/ui/pagination'
import type { Transaction } from '@/types/transaction'
import { groupBy } from '@/utils/utility'

export function Transactions() {
    const LIMIT = 5
    const transactionContext = useContext(TransactionContext)

    if (!transactionContext) {
        throw new Error('TransactionContext not found')
    }

    const {
        transactions,
        filters,
        updateTransaction,
        deleteTransaction,
        getTransactions,
    } = transactionContext

    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(0)

    // Filter transactions by search term
    const filteredTransactions = useMemo(() => {
        if (!filters) return transactions
        return getTransactions(filters)
    }, [transactions, filters])

    // Sort by date (newest first)
    const sortedTransactions = useMemo(
        () =>
            [...filteredTransactions].sort((a, b) =>
                b.date.localeCompare(a.date)
            ),
        [filteredTransactions]
    )

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * LIMIT
        const endIndex = startIndex + LIMIT

        return sortedTransactions.slice(startIndex, endIndex)
    }, [sortedTransactions, currentPage])

    const groupedTransactions = useMemo(() => {
        return Object.values(
            groupBy(paginatedTransactions, (tx) => tx.date)
        ).map((transactions) => ({
            date: transactions[0].date,
            transactions,
        }))
    }, [paginatedTransactions])

    useEffect(() => {
        setCurrentPage(1)
    }, [transactions, filters])

    useEffect(() => {
        setTotalPages(Math.ceil(sortedTransactions.length / LIMIT))
    }, [sortedTransactions])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const editingTransaction = editingId
        ? transactions.find((t) => t.id === editingId)
        : null

    const handleEdit = (
        transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            updateTransaction(editingId!, transaction)
            setEditingId(null)
            toast.success('The transaction has been updated.')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Update failed')
        }
    }

    const handleDelete = () => {
        if (!deleteConfirm) return
        try {
            deleteTransaction(deleteConfirm)
            setDeleteConfirm(null)
            toast.success('The transaction has been deleted.')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Deletion failed')
        }
    }
    return (
        <div className="p-4">
            <div>
                <h1 className="text-3xl font-bold mb-4">Transactions</h1>
                <p className="text-muted-foreground">
                    View and manage all your transactions in one place.
                </p>
            </div>

            <Filters />

            <div>
                <p className="text-sm text-muted-foreground mb-4">
                    Showing {sortedTransactions.length} transactions
                </p>
                <TransactionList
                    transactions={Object.values(groupedTransactions)}
                    onEdit={setEditingId}
                    onDelete={setDeleteConfirm}
                />
            </div>
            {totalPages > 1 && (
                <div className="py-5">
                    <PaginationWithSelect
                        pages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit transaction</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    {editingTransaction && (
                        <TransactionForm
                            initialData={editingTransaction}
                            onSubmit={handleEdit}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog
                open={!!deleteConfirm}
                onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete transaction</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this transaction?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
