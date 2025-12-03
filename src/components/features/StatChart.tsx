import type { MonthlyData } from '@/types/statistic'
import { Bar, BarChart, XAxis, Tooltip } from 'recharts'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/utils/formatCurrency'
import { clsx } from 'clsx'

interface StatChartProps {
    title: string
    value: string
    compare: number
    data: MonthlyData[]
}

const chartConfig = {
    expense: {
        label: 'Expenses',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig

export const StatChart = ({ title, value, compare, data }: StatChartProps) => {
    return (
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cfe7df] p-6">
            <p className="text-muted-foreground text-base font-medium leading-normal">
                {title}
            </p>
            <p className="text-muted-foreground tracking-light text-[32px] font-bold leading-tight truncate">
                {value}
            </p>
            <div className="flex gap-1">
                <p className="text-primary text-base font-normal leading-normal">
                    This Month
                </p>
                <p
                    className={clsx(
                        'text-base font-medium leading-normal',
                        compare >= 0 ? 'text-primary' : 'text-destructive'
                    )}>
                    {compare > 0 ? '+' : ''} {compare}%
                </p>
            </div>
            <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={data}>
                    <Bar dataKey="expense" fill="var(--chart-2)" radius={4} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 2)}
                    />
                    <Tooltip
                        cursor={false}
                        formatter={(value) => formatCurrency(value as number)}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
