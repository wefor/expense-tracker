import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Category } from '@/types/category'

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Category name cannot exceed 50 characters'),
    type: z.enum(['income', 'expense']),
    icon: z.string().min(1, 'Please select an icon'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
    initialData?: Category
    onSubmit: (data: Omit<Category, 'id'>) => void
    onCancel: () => void
}

const COMMON_ICONS = [
    '🍔', '🚌', '🏠', '🛍️', '🎮', '💊', '📚', '💼', '✈️', '🏦',
    '💰', '🎁', '📈', '🤝', '✨', '🍕', '🚗', '🎬', '⚽', '📱',
    '💻', '📷', '🎵', '🎨', '🏋️', '🍺', '☕', '🌮', '🍰', '🎯',
]

const COMMON_COLORS = [
    '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981',
    '#6366F1', '#FBBF24', '#06B6D4', '#6B7280', '#14B8A6', '#F59E0B',
    '#84CC16', '#A855F7', '#F43F5E', '#22C55E', '#0EA5E9', '#EAB308',
]

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            name: '',
            type: 'expense',
            icon: '🏦',
            color: '#6B7280',
        },
    })

    const selectedIcon = watch('icon')
    const selectedColor = watch('color')

    const handleFormSubmit = (data: CategoryFormData) => {
        onSubmit(data)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter category name"
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>

            {/* Category Type */}
            <div className="space-y-2">
                <Label>Category Type</Label>
                <RadioGroup
                    value={watch('type')}
                    onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income" className="cursor-pointer">Income</Label>
                    </div>
                </RadioGroup>
                {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-10 gap-2">
                    {COMMON_ICONS.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setValue('icon', icon)}
                            className={`
                                flex items-center justify-center w-10 h-10 text-2xl rounded-lg
                                transition-all hover:bg-accent
                                ${selectedIcon === icon ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                            `}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
                {errors.icon && (
                    <p className="text-sm text-destructive">{errors.icon.message}</p>
                )}
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-9 gap-2">
                    {COMMON_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setValue('color', color)}
                            className={`
                                w-10 h-10 rounded-lg transition-all
                                ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}
                            `}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        type="color"
                        {...register('color')}
                        className="w-20 h-10"
                    />
                    <span className="text-sm text-muted-foreground">Or enter custom color</span>
                </div>
                {errors.color && (
                    <p className="text-sm text-destructive">{errors.color.message}</p>
                )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
                <Label>Preview</Label>
                <div
                    className="flex items-center gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: selectedColor + '20' }}
                >
                    <span className="text-3xl">{selectedIcon}</span>
                    <span className="text-lg font-medium" style={{ color: selectedColor }}>
                        {watch('name') || 'Category Name'}
                    </span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? 'Update' : 'Add'}
                </Button>
            </div>
        </form>
    )
}
