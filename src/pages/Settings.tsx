import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsContext } from '@/context/SettingsContext'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import { LanguageContext } from '@/context/LanguageContext'
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryCard } from '@/components/features/CategoryCard'
import { CategoryForm } from '@/components/features/CategoryForm'
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories'
import type { Category } from '@/types/category'
import { toast } from 'sonner'

export function Settings() {
    const { t } = useTranslation()
    const settingsContext = useContext(SettingsContext)
    const transactionContext = useContext(TransactionContext)
    const categoriesContext = useContext(CategoriesContext)
    const languageContext = useContext(LanguageContext)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>(
        'success'
    )
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    )

    if (
        !settingsContext ||
        !transactionContext ||
        !categoriesContext ||
        !languageContext
    ) {
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
    const { language, changeLanguage } = languageContext

    const expenseCategories = getCategoriesByType('expense')
    const incomeCategories = getCategoriesByType('income')

    const themeOptions: SelectOption[] = [
        { label: t('settings.light'), value: 'light' },
        { label: t('settings.dark'), value: 'dark' },
        { label: t('settings.system'), value: 'system' },
    ]

    const currencyOptions: SelectOption[] = [
        { label: 'USD', value: 'USD' },
        { label: 'TWD', value: 'TWD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'JPY', value: 'JPY' },
    ]

    const languageOptions: SelectOption[] = [
        { label: 'English', value: 'en' },
        { label: '繁體中文', value: 'zh-TW' },
    ]

    const handleUpdateTheme = (val: 'light' | 'dark' | 'system') => {
        updateSettings({ ...settings, theme: val })
    }

    const handleUpdateCurrency = (val: string) => {
        updateSettings({ ...settings, currency: val })
    }

    const handleUpdateLanguage = (val: string) => {
        changeLanguage(val as 'en' | 'zh-TW')
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
            setMessage(t('settings.dataExported'))
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setMessageType('error')
            setMessage(
                err instanceof Error ? err.message : t('settings.exportFailed')
            )
        }
    }

    const handleClearData = () => {
        if (window.confirm(t('settings.clearDataConfirm'))) {
            try {
                deleteAllTransactions()
                window.location.reload()
            } catch (err) {
                setMessageType('error')
                setMessage(
                    err instanceof Error
                        ? err.message
                        : t('settings.cleanupFailed')
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

        if (
            window.confirm(t('settings.deleteConfirm', { name: category.name }))
        ) {
            deleteCategory(id)
            toast.success(t('settings.categoryDeleted'))
        }
    }

    const handleSubmitCategory = (data: Omit<Category, 'id'>) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, data)
            toast.success(t('settings.categoryUpdated'))
        } else {
            addCategory(data)
            toast.success(t('settings.categoryAdded'))
        }
        setDialogOpen(false)
        setEditingCategory(null)
    }

    const handleResetCategories = () => {
        if (window.confirm(t('settings.resetConfirm'))) {
            resetToDefault()
            toast.success(t('settings.categoriesReset'))
        }
    }

    const isDefaultCategory = (id: string) => {
        return DEFAULT_CATEGORIES.some((cat) => cat.id === id)
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{t('settings.title')}</h1>
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
                    {t('settings.appearance')}
                </h2>
                <div className="flex items-center gap-4  md:px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            {t('settings.theme')}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            {t('settings.themeDescription')}
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
                    {t('settings.general')}
                </h2>
                <div className="flex items-center gap-4  md:px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            {t('settings.defaultCurrency')}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            {t('settings.currencyDescription')}
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
                                <SelectValue
                                    placeholder={t('settings.selectCurrency')}>
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
                <div className="flex items-center gap-4  md:px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            {t('settings.language')}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            {t('settings.languageDescription')}
                        </p>
                    </div>
                    <div className="shrink-0">
                        <div className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-muted-foreground text-sm font-medium leading-normal w-fit">
                            <span>
                                {
                                    languageOptions.find(
                                        (opt) => opt.value === language
                                    )?.label
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 md:px-2 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                        <Select
                            value={language}
                            onValueChange={handleUpdateLanguage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue
                                    placeholder={t('settings.selectLanguage')}>
                                    {
                                        languageOptions.find(
                                            (opt) => opt.value === language
                                        )?.label
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {languageOptions.map((option) => (
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
                            {t('settings.categories')}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            {t('settings.categoriesDescription')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetCategories}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {t('settings.resetToDefault')}
                        </Button>
                        <Button size="sm" onClick={handleAddCategory}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('settings.addCategory')}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="expense" className="w-full mt-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2 bg-background rounded-none border-b p-0 md:gap-6">
                        <TabsTrigger
                            value="expense"
                            className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none">
                            {t('settings.expense')} ({expenseCategories.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="income"
                            className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none">
                            {t('settings.income')} ({incomeCategories.length})
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
                                <p className="text-muted-foreground">
                                    {t('settings.noExpenseCategories')}
                                </p>
                                <Button
                                    onClick={handleAddCategory}
                                    className="mt-4"
                                    size="sm">
                                    {t('settings.addFirstExpense')}
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
                                <p className="text-muted-foreground">
                                    {t('settings.noIncomeCategories')}
                                </p>
                                <Button
                                    onClick={handleAddCategory}
                                    className="mt-4"
                                    size="sm">
                                    {t('settings.addFirstIncome')}
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <div className="card p-2 md-p4 ">
                <h2 className="text-xl font-bold text-foreground pb-3 pt-5">
                    {t('settings.dataManagement')}
                </h2>
                <div className="flex items-center gap-4 md:px-4  min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            {t('settings.exportData')}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            {t('settings.exportDescription')}
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            onClick={handleExportData}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-primary-foreground text-sm font-medium leading-normal w-fit">
                            <span className="truncate">
                                {t('common.export')}
                            </span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 md:px-4  min-h-[72px] py-2 justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                            {t('settings.deleteAllData')}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                            {t('settings.deleteAllDescription')}
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            onClick={handleClearData}
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-primary-foreground text-sm font-medium leading-normal w-fit">
                            <span className="truncate">
                                {t('common.delete')}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Category Form Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                                ? t('settings.editCategory')
                                : t('settings.addCategory')}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? t('settings.editCategoryDescription')
                                : t('settings.addCategoryDescription')}
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
