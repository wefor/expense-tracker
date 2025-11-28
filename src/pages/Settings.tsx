import { useContext, useState } from 'react'
import { SettingsContext } from '@/context/SettingsContext'
import { TransactionContext } from '@/context/TransactionContext'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import {
    type SelectOption,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function Settings() {
    const settingsContext = useContext(SettingsContext)
    const transactionContext = useContext(TransactionContext)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>(
        'success'
    )

    if (!settingsContext || !transactionContext) {
        throw new Error('Required context not found')
    }
    const { settings, updateSettings } = settingsContext
    const { transactions, deleteAllTransactions } = transactionContext

    const themeOptions: SelectOption[] = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
    ]

    const currencyOptions: SelectOption[] = [
        { label: 'USD', value: 'USD' },
        { label: 'TWD', value: 'TWD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'JPY', value: 'JPY' },
    ]

    const handleUpdateTheme = (val: 'light' | 'dark' | 'system') => {
        updateSettings({ ...settings, theme: val })
    }

    const handleUpdateCurrency = (val: string) => {
        updateSettings({ ...settings, currency: val })
    }

    const handleExportData = () => {
        try {
            const data = {
                transactions,
                exportDate: new Date().toISOString(),
            }
            const dataStr = JSON.stringify(data, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `expense-tracker-${Date.now()}.json`
            link.click()
            URL.revokeObjectURL(url)
            setMessageType('success')
            setMessage('Data has been exported')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setMessageType('error')
            setMessage(err instanceof Error ? err.message : 'Outbound failed')
        }
    }

    const handleClearData = () => {
        if (
            window.confirm(
                'Are you sure you want to clear all data? This operation cannot be undone!'
            )
        ) {
            try {
                deleteAllTransactions()
                window.location.reload()
            } catch (err) {
                setMessageType('error')
                setMessage(
                    err instanceof Error ? err.message : 'Cleanup failed'
                )
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            {message && (
                <Alert
                    variant={
                        messageType === 'error' ? 'destructive' : 'default'
                    }>
                    <AlertCircleIcon />
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            <div className="card p-2 md-p4 ">
                <h2 className="text-xl font-bold text-foreground pb-3 pt-5">
                    Appearance
                </h2>
                <div className="flex items-center gap-4  md:px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            Theme
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            Choose between a light or dark theme for the app.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <div className="flex min-w-[84px] items-center justify-center overflow-hidden  h-8 px-4 text-muted-foreground text-sm font-medium leading-normal w-fit">
                            <span className="capitalize">{settings.theme}</span>
                        </div>
                    </div>
                </div>
                <div className="flex md:px-2 py-3">
                    <RadioGroup
                        defaultValue="system"
                        onValueChange={handleUpdateTheme}
                        className="flex h-10 flex-1 items-center justify-around rounded-lg bg-secondary p-1">
                        {themeOptions.map((theme) => (
                            <div
                                key={theme.value}
                                className="flex grow items-center space-x-2 h-full">
                                <Label
                                    htmlFor={`theme-${theme.value}`}
                                    className={clsx(
                                        'flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-primary text-sm font-medium leading-normal',
                                        settings.theme === theme.value
                                            ? 'bg-primary shadow-[0_0_4px_rgba(0,0,0,0.1)] text-primary-foreground'
                                            : ''
                                    )}>
                                    <RadioGroupItem
                                        value={theme.value}
                                        id={`theme-${theme.value}`}
                                        className="invisible w-0"
                                    />
                                    <span className="truncate">
                                        {theme.label}
                                    </span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
            <div className="card p-2 md-p4 ">
                <h2 className="text-xl font-bold text-foreground pb-3 pt-5">
                    General
                </h2>
                <div className="flex items-center gap-4  md:px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            Default Currency
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            Set the default currency for all transactions.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <div className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-muted-foreground text-sm font-medium leading-normal w-fit">
                            <span>{settings.currency}</span>
                        </div>
                    </div>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 md:px-2 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                        <Select
                            value={settings.currency}
                            onValueChange={handleUpdateCurrency}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Currency">
                                    {settings.currency}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {currencyOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                </div>
            </div>
            <div className="card p-2 md-p4 ">
                <h2 className="text-xl font-bold text-foreground pb-3 pt-5">
                    Data Management
                </h2>
                <div className="flex items-center gap-4 md:px-4  min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            Export Data
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            Export all your expense data to a CSV file.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            onClick={handleExportData}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-primary-foreground text-sm font-medium leading-normal w-fit">
                            <span className="truncate">Export</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 md:px-4  min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            Delete All Data
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            Permanently delete all your expense data. This
                            action cannot be undone.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            onClick={handleClearData}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-primary-foreground text-sm font-medium leading-normal w-fit">
                            <span className="truncate">Delete</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
