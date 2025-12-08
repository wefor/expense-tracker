/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useReducer, useCallback, useEffect } from 'react'
import type { Transaction, FilterOptions } from '@/types/transaction'
import { useTransactions } from '../hooks/useTransactions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { generateId } from '../utils/validation'

interface TransactionState {
    transactions: Transaction[]
    filters: FilterOptions
}

type TransactionAction =
    | {
          type: 'ADD_TRANSACTION'
          payload: Omit<Transaction, 'createdAt' | 'updatedAt'>
      }
    | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
    | { type: 'DELETE_TRANSACTION'; payload: string }
    | { type: 'DELETE_ALL_TRANSACTIONS' }
    | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'SET_TRANSACTION_FILTERS'; payload: FilterOptions }

function transactionReducer(
    state: TransactionState,
    action: TransactionAction
): TransactionState {
    switch (action.type) {
        case 'ADD_TRANSACTION': {
            const newTransaction: Transaction = {
                ...action.payload,
                // id: generateId(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            return {
                ...state,
                transactions: [newTransaction, ...state.transactions],
            }
        }

        case 'UPDATE_TRANSACTION': {
            return {
                ...state,
                transactions: state.transactions.map((t) =>
                    t.id === action.payload.id
                        ? { ...action.payload, updatedAt: Date.now() }
                        : t
                ),
            }
        }

        case 'DELETE_TRANSACTION': {
            return {
                ...state,
                transactions: state.transactions.filter(
                    (t) => t.id !== action.payload
                ),
            }
        }

        case 'DELETE_ALL_TRANSACTIONS': {
            return {
                ...state,
                transactions: [],
            }
        }

        case 'SET_TRANSACTIONS': {
            return {
                ...state,
                transactions: action.payload,
            }
        }

        case 'SET_TRANSACTION_FILTERS': {
            return {
                ...state,
                filters: action.payload,
            }
        }

        default:
            return state
    }
}

export interface TransactionContextValue {
    transactions: Transaction[]
    filters: FilterOptions
    addTransaction: (
        transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
    ) => void
    updateTransaction: (id: string, transaction: Partial<Transaction>) => void
    deleteTransaction: (id: string) => void
    deleteAllTransactions: () => void
    getTransactions: (filter?: FilterOptions) => Transaction[]
    setFilters: (filter: FilterOptions) => void
}

export const TransactionContext = createContext<
    TransactionContextValue | undefined
>(undefined)

interface TransactionProviderProps {
    children: ReactNode
}

const STORAGE_KEY = 'expense-tracker-transactions'

export function TransactionProvider({ children }: TransactionProviderProps) {
    const [storedTransactions, setStoredTransactions] = useLocalStorage<
        Transaction[]
    >(STORAGE_KEY, [])

    const [state, dispatch] = useReducer(transactionReducer, {
        transactions: storedTransactions,
        filters: {
            type: 'all',
            searchTerm: '',
        },
    })

    const transactionHooks = useTransactions(state.transactions)

    // Sync reducer state to localStorage whenever transactions change
    useEffect(() => {
        setStoredTransactions(state.transactions)
    }, [state.transactions, setStoredTransactions])

    const addTransaction = useCallback(
        (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
            const uuid = generateId()
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: { ...transaction, id: uuid },
            })
        },
        []
    )

    const updateTransaction = useCallback(
        (id: string, updates: Partial<Transaction>) => {
            const existingTransaction = state.transactions.find((t) => t.id === id)
            if (existingTransaction) {
                dispatch({
                    type: 'UPDATE_TRANSACTION',
                    payload: {
                        ...existingTransaction,
                        ...updates,
                        id,
                    } as Transaction,
                })
            }
        },
        [state.transactions]
    )

    const deleteTransaction = useCallback(
        (id: string) => {
            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id,
            })
        },
        []
    )

    const deleteAllTransactions = useCallback(() => {
        dispatch({
            type: 'DELETE_ALL_TRANSACTIONS',
        })
    }, [])

    const setFilters = useCallback(
        (updates: Partial<FilterOptions>) => {
            dispatch({
                type: 'SET_TRANSACTION_FILTERS',
                payload: {
                    ...state.filters,
                    ...updates,
                },
            })
        },
        [state.filters]
    )

    const getTransactions = useCallback(
        (filter?: FilterOptions) => {
            if (!filter) return state.transactions

            return transactionHooks.filterTransactions(filter)
        },
        [state.transactions, transactionHooks]
    )

    const value: TransactionContextValue = {
        transactions: state.transactions,
        filters: state.filters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        deleteAllTransactions,
        setFilters,
        getTransactions,
    }

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    )
}
