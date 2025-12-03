import { formatCurrency } from '@/utils/formatCurrency'
import type { CategoryStat } from '@/types/statistic'

interface CategoryExpenditureProps {
    stat: CategoryStat
}
export function CategoryExpenditure({ stat }: CategoryExpenditureProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <p className="font-medium text-card-foreground">
                    {stat.icon} {stat.name}
                </p>
                <div className="mt-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-chart-2 h-full"
                        style={{
                            width: `${stat.percentage}%`,
                        }}
                    />
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-muted-foreground">
                    {formatCurrency(stat.amount)}
                </p>
                <p className="text-sm text-gray-500">{stat.percentage}%</p>
            </div>
        </div>
    )
}
