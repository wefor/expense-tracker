import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatTabContent } from '@/components/features/StatTabContent'

export function Analytics() {
    const { t } = useTranslation()
    const tabs = [
        {
            name: t('analytics.thisMonth'),
            value: 'this-month',
            content: <StatTabContent range="month" />,
        },
        {
            name: t('analytics.lastMonth'),
            value: 'last-month',
            content: <StatTabContent range="last-month" />,
        },
        {
            name: t('analytics.thisYear'),
            value: 'this-year',
            content: <StatTabContent range="year" />,
        },
        {
            name: t('analytics.lastYear'),
            value: 'last-year',
            content: <StatTabContent range="last-year" />,
        },
    ]

    return (
        <div className="p-4">
            <div className="py-5">
                <h1 className="text-3xl font-bold mb-4">{t('analytics.title')}</h1>
            </div>
            <div className="pb-3">
                <Tabs defaultValue="this-month" className="gap-6 w-full">
                    <TabsList className="bg-background rounded-none border-b p-0 md:gap-6">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none">
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <div className="text-muted-foreground text-sm">
                                {tab.content}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}
