import type { CategoryStat } from '@/types/statistic'
import { PieChart, Pie, Tooltip, Cell } from 'recharts'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/utils/formatCurrency'
interface CategoryChartProps {
    title: string
    data: CategoryStat[]
}

const chartConfig = {
    category: {
        label: 'Amount',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig

export const CategoryChart = ({ title, data }: CategoryChartProps) => {
    const COLORS = [
        '#4c9a80',
        '#EC4899',
        '#F97316',
        '#F59E0B',
        '#14B8A6',
        '#06B6D4',
        '#0EA5E9',
        '#3B82F6',
        '#6366F1',
        '#8B5CF6',
    ]

    return (
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cfe7df] p-6">
            <p className="text-muted-foreground text-base font-medium leading-normal">
                {title}
            </p>
            <ChartContainer
                config={chartConfig}
                className="min-h-[300px] w-full">
                <PieChart>
                    <Pie
                        data={data as unknown as Record<string, unknown>[]}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry: unknown) => {
                            const e = entry as Record<string, unknown>
                            return `${e.name} (${e.percentage}%)`
                        }}>
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                    />
                </PieChart>
            </ChartContainer>
        </div>
    )
}
