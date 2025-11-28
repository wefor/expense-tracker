import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransactionForm } from '@/components/features/TransactionForm'
import { TransactionContext } from '@/context/TransactionContext'
import type { Transaction } from '@/types/transaction'

export function AddTransaction() {
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
            navigate('/transactions')
        } catch (err) {
            setError(err instanceof Error ? err.message : '新增交易失敗')
        }
    }
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Add New Transaction</h1>
            <TransactionForm onSubmit={handleSubmit} error={error} />
        </div>
    )
}
