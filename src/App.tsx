import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Overview } from '@/pages/Overview'
import { Transactions } from '@/pages/Transactions'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { AddTransaction } from '@/pages/AddTransaction'
import { SettingsProvider } from '@/context/SettingsContext'
import { TransactionProvider } from '@/context/TransactionContext'
import { CategoriesProvider } from '@/context/CategoriesContext'

function App() {
    return (
        <BrowserRouter>
            <CategoriesProvider>
                <TransactionProvider>
                    <SettingsProvider>
                        <Layout>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/overview" replace />
                                    }
                                />
                                <Route
                                    path="/overview"
                                    element={<Overview />}
                                />
                                <Route
                                    path="/transactions"
                                    element={<Transactions />}
                                />
                                <Route
                                    path="/analytics"
                                    element={<Analytics />}
                                />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                                <Route
                                    path="/add-transaction"
                                    element={<AddTransaction />}
                                />
                            </Routes>
                        </Layout>
                    </SettingsProvider>
                </TransactionProvider>
            </CategoriesProvider>
        </BrowserRouter>
    )
}

export default App
