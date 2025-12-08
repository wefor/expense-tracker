import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { SettingsProvider } from '@/context/SettingsContext'
import { TransactionProvider } from '@/context/TransactionContext'
import { CategoriesProvider } from '@/context/CategoriesContext'
import { LanguageProvider } from '@/context/LanguageContext'

// Lazy load route components for code splitting
const Overview = lazy(() => import('@/pages/Overview').then(m => ({ default: m.Overview })))
const Transactions = lazy(() => import('@/pages/Transactions').then(m => ({ default: m.Transactions })))
const Analytics = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.Analytics })))
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))
const AddTransaction = lazy(() => import('@/pages/AddTransaction').then(m => ({ default: m.AddTransaction })))

// Loading fallback component
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">載入中...</p>
            </div>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <LanguageProvider>
                <CategoriesProvider>
                    <TransactionProvider>
                        <SettingsProvider>
                            <Layout>
                                <Suspense fallback={<PageLoader />}>
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
                                </Suspense>
                            </Layout>
                        </SettingsProvider>
                    </TransactionProvider>
                </CategoriesProvider>
            </LanguageProvider>
        </BrowserRouter>
    )
}

export default App
