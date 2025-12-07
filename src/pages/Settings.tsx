import { useContext, useState } from 'react'
import { SettingsContext } from '@/context/SettingsContext'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, Plus, RotateCcw } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryCard } from '@/components/features/CategoryCard'
import { CategoryForm } from '@/components/features/CategoryForm'
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories'
import type { Category } from '@/types/category'
import { toast } from 'sonner'

export function Settings() {
    const settingsContext = useContext(SettingsContext)
    const transactionContext = useContext(TransactionContext)
    const categoriesContext = useContext(CategoriesContext)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>(
        'success'
    )
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    if (!settingsContext || !transactionContext || !categoriesContext) {
        throw new Error('Required context not found')
    }
    const { settings, updateSettings } = settingsContext
    const { transactions, deleteAllTransactions } = transactionContext
    const {
        categories,
        getCategoriesByType,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefault,
    } = categoriesContext

    const expenseCategories = getCategoriesByType('expense')
    const incomeCategories = getCategoriesByType('income')

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

    const handleAddCategory = () => {
        setEditingCategory(null)
        setDialogOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setDialogOpen(true)
    }

    const handleDeleteCategory = (id: string) => {
        const category = categories.find((c) => c.id === id)
        if (!category) return

        if (window.confirm(`Are you sure you want to delete "${category.name}" category?`)) {
            deleteCategory(id)
            toast.success('Category deleted')
        }
    }

    const handleSubmitCategory = (data: Omit<Category, 'id'>) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, data)
            toast.success('Category updated')
        } else {
            addCategory(data)
            toast.success('Category added')
        }
        setDialogOpen(false)
        setEditingCategory(null)
    }

    const handleResetCategories = () => {
        if (window.confirm('Are you sure you want to reset all categories to default? This will delete all custom categories.')) {
            resetToDefault()
            toast.success('Categories reset to default')
        }
    }

    const isDefaultCategory = (id: string) => {
        return DEFAULT_CATEGORIES.some((cat) => cat.id === id)
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
                        defaultValue={settings.theme}
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

            {/* Category Management Section */}
            <div className="card p-2 md-p4">
                <div className="flex items-center justify-between pb-3 pt-5">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Categories
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your income and expense categories
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleResetCategories}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset to Default
                        </Button>
                        <Button size="sm" onClick={handleAddCategory}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="expense" className="w-full mt-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="expense">
                            Expense ({expenseCategories.length})
                        </TabsTrigger>
                        <TabsTrigger value="income">
                            Income ({incomeCategories.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="expense" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {expenseCategories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                    isDefault={isDefaultCategory(category.id)}
                                />
                            ))}
                        </div>
                        {expenseCategories.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No expense categories</p>
                                <Button onClick={handleAddCategory} className="mt-4" size="sm">
                                    Add your first expense category
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="income" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {incomeCategories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEditCategory}
                                    onDelete={handleDeleteCategory}
                                    isDefault={isDefaultCategory(category.id)}
                                />
                            ))}
                        </div>
                        {incomeCategories.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No income categories</p>
                                <Button onClick={handleAddCategory} className="mt-4" size="sm">
                                    Add your first income category
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
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

            {/* Category Form Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Add Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Update the category name, icon, color, and type.'
                                : 'Create a new category by selecting an icon, color, and type.'}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        initialData={editingCategory || undefined}
                        onSubmit={handleSubmitCategory}
                        onCancel={() => {
                            setDialogOpen(false)
                            setEditingCategory(null)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
