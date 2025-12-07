import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TransactionForm } from '@/components/features/TransactionForm'
import { TransactionContext } from '@/context/TransactionContext'
import type { Transaction } from '@/types/transaction'
import { toast } from 'sonner'

export function AddTransaction() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const transactionContext = useContext(TransactionContext)
    const [error, setError] = useState<string>('')

    if (!transactionContext) {
        throw new Error('TransactionContext not found')
    }

    const handleSubmit = (
        transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            transactionContext.addTransaction(transaction)
            toast.success(t('addTransaction.transactionAdded'))
            navigate('/transactions')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add transaction')
        }
    }
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{t('addTransaction.title')}</h1>
            <TransactionForm onSubmit={handleSubmit} error={error} />
        </div>
    )
}
