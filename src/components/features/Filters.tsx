import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category } from '@/types/category'
import { TransactionContext } from '@/context/TransactionContext'
import { CategoriesContext } from '@/context/CategoriesContext'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { type CheckedState, Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { type DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import MagnifyingGlass from '@/components/common/icons/MagnifyingGlass'
import { XIcon, Plus, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateDisplay, formatDateISO } from '@/utils/formatDate'
import { clsx } from 'clsx'

export function Filters() {
    const { t } = useTranslation()
    const transactionContext = useContext(TransactionContext)
    const categoriesContext = useContext(CategoriesContext)

    if (!transactionContext || !categoriesContext) {
        throw new Error('Required context not found')
    }

    const navigate = useNavigate()
    const { categories } = categoriesContext
    const { filters, setFilters } = transactionContext
    const [isOpen, setIsOpen] = useState(false)
    const [byType, setByType] = useState('all')
    const [byCategories, setByCategories] = useState<string[]>([])

    const [byDateRange, setByDateRange] = useState<DateRange | undefined>(
        undefined
    )
    const [byAmount, setByAmount] = useState<number[]>([0, 0])
    const [categoryList, setCategoryList] = useState<Category[]>(categories)

    const handleTypeChange = (val: string) => {
        setByType(val)
        setByCategories([])
        switch (val) {
            case 'expense':
                setCategoryList(
                    categories.filter((cat) => cat.type === 'expense')
                )
                break
            case 'income':
                setCategoryList(
                    categories.filter((cat) => cat.type === 'income')
                )
                break

            default:
                setCategoryList(categories)
                break
        }
    }
    const handleCateChange = (checked: CheckedState, category: string) => {
        if (checked) {
            setByCategories([category, ...byCategories])
        } else {
            setByCategories(byCategories.filter((cate) => cate != category))
        }
    }

    const handleReset = () => {
        setByType('all')
        setByCategories([])
        setByDateRange(undefined)
        setByAmount([0, 0])
        setFilters({
            type: 'all',
            categories: [],
            dateRange: undefined,
            amountRange: undefined,
        })
    }

    const handleApply = () => {
        setFilters({
            type: byType as 'all' | 'expense' | 'income',
            categories: byCategories,
            dateRange:
                byDateRange?.from && byDateRange?.to
                    ? {
                          start: formatDateISO(byDateRange.from),
                          end: formatDateISO(byDateRange.to),
                      }
                    : undefined,
            amountRange: { min: byAmount[0], max: byAmount[1] },
        })
    }

    return (
        <div className="flex flex-col gap-4 py-3">
            <div className="flex gap-4">
                <InputGroup>
                    <InputGroupAddon>
                        <InputGroupText>
                            <MagnifyingGlass />
                        </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder={t('filters.searchPlaceholder')}
                        value={filters.searchTerm}
                        id="form-amount"
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                searchTerm: e.target.value,
                            })
                        }
                    />
                    <InputGroupAddon align="inline-end">
                        <XIcon
                            className="cursor-pointer hover:bg-accent/20 rounded-full"
                            onClick={() =>
                                setFilters({ ...filters, searchTerm: '' })
                            }
                        />
                    </InputGroupAddon>
                </InputGroup>

                <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
                    {t('filters.title')} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
                <Button
                    size="icon"
                    onClick={() => navigate('/add-transaction')}>
                    <Plus />
                </Button>
            </div>
            <Card className={clsx(isOpen ? 'block' : 'hidden')}>
                <CardHeader>
                    <CardTitle className="text-2xl text-bold">
                        {t('filters.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>{t('filters.type')}</Label>
                    <div className="flex flex-wrap gap-4 p-4">
                        <RadioGroup
                            defaultValue="all"
                            value={byType}
                            onValueChange={handleTypeChange}
                            className="flex items-center flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="all" id="rdo-all" />
                                <Label htmlFor="rdo-all">{t('filters.all')}</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="expense"
                                    id="rdo-expense"
                                />
                                <Label htmlFor="rdo-expense">{t('settings.expense')}</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="income"
                                    id="rdo-income"
                                />
                                <Label htmlFor="rdo-income">{t('settings.income')}</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Label className="mt-3">{t('filters.categories')}</Label>
                    <div className="flex flex-wrap gap-4 p-4">
                        {categoryList.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-2">
                                <Checkbox
                                    id={category.id}
                                    value={category.id}
                                    checked={byCategories.includes(category.id)}
                                    onCheckedChange={(e) =>
                                        handleCateChange(e, category.id)
                                    }
                                />
                                <Label htmlFor={category.id}>
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <Label className="my-3">
                        {t('filters.dateRange')}{' '}
                        {byDateRange && (
                            <span className="text-muted-foreground">
                                {byDateRange.from &&
                                    formatDateDisplay(byDateRange.from)}{' '}
                                ~{' '}
                                {byDateRange.to &&
                                    formatDateDisplay(byDateRange.to)}
                            </span>
                        )}
                    </Label>
                    <Calendar
                        mode="range"
                        defaultMonth={byDateRange?.from}
                        selected={byDateRange}
                        onSelect={setByDateRange}
                        numberOfMonths={2}
                        className="rounded-lg border shadow-sm"
                    />
                    <Label className="my-6">
                        {t('filters.amountRange')}{' '}
                        {byAmount[1] > 0 && (
                            <span className="text-muted-foreground">
                                {byAmount[0]} ~ {byAmount[1]}
                            </span>
                        )}
                    </Label>

                    <Slider
                        defaultValue={[0, 0]}
                        max={10000}
                        step={100}
                        value={byAmount}
                        onValueChange={setByAmount}
                    />
                </CardContent>
                <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch mt-3">
                    <Button variant="outline" onClick={handleReset}>
                        {t('filters.reset')}
                    </Button>
                    <Button onClick={handleApply}>{t('filters.apply')}</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
