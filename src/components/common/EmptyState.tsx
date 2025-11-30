import type { ReactNode } from 'react'

interface EmptyStateProps {
    icon?: string
    title: string
    description?: string
    action?: ReactNode
}

export function EmptyState({
    icon = '📭',
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-foreground mb-4">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    )
}
