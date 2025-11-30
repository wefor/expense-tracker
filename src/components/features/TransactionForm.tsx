import { useState, useContext, useEffect } from 'react'
import { CategoriesContext } from '@/context/CategoriesContext'
import { TransactionContext } from '@/context/TransactionContext'
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

const formSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().min(1, '請輸入金額'),
    category: z.string().min(2, '請選擇分類'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '請選擇日期'),
    description: z.string('備註必須為文字'),
})

export function TransactionForm({
    onSubmit,
    initialData,
    isLoading = false,
    error,
}: TransactionFormProps) {
    const categoriesContext = useContext(CategoriesContext)
    const transactionContext = useContext(TransactionContext)
    if (!categoriesContext || !transactionContext) {
        throw new Error(
            'CategoriesContext or TransactionContext not found. Please ensure that TransactionForm is used within a CategoriesProvider.'
        )
    }
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

    const [open, setOpen] = useState(false)
    const typeOptions: SelectOption[] = [
        { label: 'Expense', value: 'expense' },
        { label: 'Income', value: 'income' },
    ]
    const expenseCategories = categoriesContext
        .getCategoriesByType('expense')
        .map((cat) => ({ value: cat.id, label: `${cat.icon} ${cat.name}` }))
    const incomeCategories = categoriesContext
        .getCategoriesByType('income')
        .map((cat) => ({
            value: cat.id,
            label: `${cat.icon} ${cat.name}`,
        }))

    const [categoriesOptions, setCategoryOptions] = useState(expenseCategories)

    useEffect(() => {
        if (initialData && initialData.type === 'income') {
            setCategoryOptions(incomeCategories)
        }
    }, [initialData])

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
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={(type) => {
                                        if (type === 'income') {
                                            setCategoryOptions(incomeCategories)
                                        } else {
                                            setCategoryOptions(
                                                expenseCategories
                                            )
                                        }
                                        field.onChange(type)
                                    }}
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
                                Category
                            </FieldLabel>
                            <Select
                                name={field.name}
                                value={field.value}
                                aria-invalid={fieldState.invalid}
                                onValueChange={field.onChange}>
                                <SelectTrigger
                                    id="form-category"
                                    aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Select Category" />
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
                                Choose how often you want to be billed.
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
                                Amount
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon>
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="0.00"
                                    name={field.name}
                                    value={field.value}
                                    aria-invalid={fieldState.invalid}
                                    id="form-amount"
                                    onChange={(e) => {
                                        field.onChange(Number(e.target.value))
                                    }}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>USD</InputGroupText>
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
                            <FieldLabel htmlFor="form-date">Date</FieldLabel>
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
                                            : 'Select Date'}
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
                                Description
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
                        Reset
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}
