import { useState, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CategoriesContext } from '@/context/CategoriesContext'
import { TransactionContext } from '@/context/TransactionContext'
import { SettingsContext } from '@/context/SettingsContext'
import type { Transaction } from '@/types/transaction'
import { formatDateISO } from '@/utils/formatDate'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { clsx } from 'clsx'
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import {
    type SelectOption,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '../ui/textarea'

export interface TransactionFormProps {
    onSubmit: (
        transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
    ) => void
    initialData?: Partial<Transaction>
    isLoading?: boolean
    error?: string
}

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        type: z.enum(['income', 'expense']),
        amount: z.number().min(1, t('addTransaction.amountRequired')),
        category: z.string().min(2, t('addTransaction.categoryRequired')),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('addTransaction.dateRequired')),
        description: z.string(t('addTransaction.description')),
    })

export function TransactionForm({
    onSubmit,
    initialData,
    isLoading = false,
}: TransactionFormProps) {
    const { t } = useTranslation()
    const categoriesContext = useContext(CategoriesContext)
    const transactionContext = useContext(TransactionContext)
    const settingsContext = useContext(SettingsContext)

    if (!categoriesContext || !transactionContext || !settingsContext) {
        throw new Error(
            'Context not found. Please ensure that TransactionForm is used within a Provider.'
        )
    }
    const formSchema = createFormSchema(t)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: initialData ? initialData.type : 'expense',
            category: initialData ? initialData.category : '',
            amount: initialData ? initialData.amount : 0,
            date: initialData ? initialData.date : formatDateISO(new Date()),
            description: initialData ? initialData.description : '',
        },
    })

    const { settings } = settingsContext

    const [open, setOpen] = useState(false)
    const typeOptions: SelectOption[] = [
        { label: t('addTransaction.expense'), value: 'expense' },
        { label: t('addTransaction.income'), value: 'income' },
    ]

    // Memoize category options to prevent unnecessary recalculations
    const expenseCategories = useMemo(
        () => categoriesContext
            .getCategoriesByType('expense')
            .map((cat) => ({ value: cat.id, label: `${cat.icon} ${cat.name}` })),
        [categoriesContext]
    )

    const incomeCategories = useMemo(
        () => categoriesContext
            .getCategoriesByType('income')
            .map((cat) => ({ value: cat.id, label: `${cat.icon} ${cat.name}` })),
        [categoriesContext]
    )

    const currentType = form.watch('type')

    // Dynamically determine category options based on selected type
    const categoriesOptions = useMemo(
        () => currentType === 'income' ? incomeCategories : expenseCategories,
        [currentType, incomeCategories, expenseCategories]
    )

    // Initialize category options based on initialData
    useEffect(() => {
        if (initialData?.type && !initialData?.category) {
            const initialCategories = initialData.type === 'income'
                ? incomeCategories
                : expenseCategories
            if (initialCategories.length > 0) {
                form.setValue('category', initialCategories[0].value)
            }
        }
    }, [initialData?.type, initialData?.category, incomeCategories, expenseCategories, form])

    function handleSubmit(values: z.infer<typeof formSchema>) {
        const result: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
            ...values,
        }
        onSubmit(result)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 rounded-xl md:p-2">
                <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('addTransaction.transactionType')}</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue="expense"
                                    className="flex h-10 flex-1 items-center justify-around rounded-lg bg-secondary p-1">
                                    {typeOptions.map((type) => (
                                        <div
                                            key={type.value}
                                            className="flex grow items-center space-x-2 h-full">
                                            <Label
                                                htmlFor={`type-${type.value}`}
                                                className={clsx(
                                                    'flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-primary text-sm font-medium leading-normal',
                                                    field.value === type.value
                                                        ? 'bg-primary shadow-[0_0_4px_rgba(0,0,0,0.1)] text-primary-foreground'
                                                        : ''
                                                )}>
                                                <RadioGroupItem
                                                    value={type.value}
                                                    id={`type-${type.value}`}
                                                    className="invisible w-0"
                                                />
                                                <span className="truncate">
                                                    {type.label}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-category">
                                {t('addTransaction.category')}
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                aria-invalid={fieldState.invalid}
                                onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="form-category"
                                    aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder={t('addTransaction.selectCategory')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesOptions.map((category) => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                {t('addTransaction.categoryDescription')}
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="amount"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-amount">
                                {t('addTransaction.amount')}
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon>
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder={t('addTransaction.amountPlaceholder')}
                                    name={field.name}
                                    value={field.value}
                                    aria-invalid={fieldState.invalid}
                                    id="form-amount"
                                    onChange={(e) => {
                                        field.onChange(Number(e.target.value))
                                    }}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>
                                        {settings.currency}
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="date"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-date">{t('addTransaction.date')}</FieldLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className={clsx(
                                            'w-48 justify-between font-normal hover:bg-transparent hover:text-foreground dark:bg-input/30 ',
                                            field.value
                                                ? 'dark:text-foreground'
                                                : 'dark:text-muted-foreground'
                                        )}>
                                        {field.value
                                            ? field.value
                                            : t('addTransaction.selectDate')}
                                        <ChevronDownIcon className="size-4 opacity-50 dark:text-foreground" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(field.value)}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(
                                                    formatDateISO(date)
                                                )
                                            }
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-description">
                                {t('addTransaction.description')}
                            </FieldLabel>
                            <Textarea
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                id="form-description"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <FieldSeparator />
                <div className="flex items-center gap-2 mt-5">
                    <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-secondary hover:text-foreground"
                        onClick={() => form.reset()}>
                        {t('addTransaction.reset')}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {t('addTransaction.submit')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
