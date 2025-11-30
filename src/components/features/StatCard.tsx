import { clsx } from 'clsx'

interface StatCardProps {
    label: string
    value: string | number
    compare: number
}

export function StatCard({ label, value, compare = 0 }: StatCardProps) {
    return (
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-card">
            <p className="text-card-foreground text-base font-medium leading-normal">
                {label}
            </p>
            <p className="text-card-foreground tracking-light text-2xl font-bold leading-tight">
                {value}
            </p>
            <p
                className={clsx(
                    'text-base font-medium leading-normal',
                    compare < 0 ? 'text-destructive' : 'text-accent'
                )}>
                <span>{compare < 0 ? '↓' : compare > 0 ? '↑' : ''}</span>
                {compare}%
            </p>
        </div>
    )
}
