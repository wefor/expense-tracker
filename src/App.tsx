import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Transactions } from '@/pages/Transactions'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { AddTransaction } from '@/pages/AddTransaction'
import { SettingsProvider } from '@/context/SettingsContext'

function App() {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <Layout>
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                            path="/add-transaction"
                            element={<AddTransaction />}
                        />
                    </Routes>
                </Layout>
            </SettingsProvider>
        </BrowserRouter>
    )
}

export default App
