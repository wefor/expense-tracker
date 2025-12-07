import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()
    const { t } = useTranslation()

    const navLinks = [
        { path: '/overview', label: t('nav.overview') },
        { path: '/transactions', label: t('nav.transactions') },
        { path: '/analytics', label: t('nav.analytics') },
        { path: '/settings', label: t('nav.settings') },
        { path: '/add-transaction', label: t('nav.addTransaction') },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <header className="md:flex md:justify-between md:items-end border-b">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">{t('common.appName')}</h2>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden flex flex-col gap-1"
                    aria-label="Toggle menu">
                    <span className="block w-6 h-0.5 bg-foreground"></span>
                    <span className="block w-6 h-0.5 bg-foreground"></span>
                    <span className="block w-6 h-0.5 bg-foreground"></span>
                </button>
            </div>

            {/* Navigation */}
            <nav
                className={`${
                    isOpen ? 'block' : 'hidden'
                } md:flex md:justify-center md:gap-6 md:pb-4 md:px-4 transition-all`}>
                <ul className="flex flex-col md:flex-row md:gap-6 divide-y md:divide-y-0 bg-secondary md:bg-transparent">
                    {navLinks.map((link) => (
                        <li
                            key={link.path}
                            className="border-b-primary dark:border-b-green-100">
                            <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 md:py-0 text-foreground ${
                                    isActive(link.path)
                                        ? 'font-bold text-accent md:border-b-2 md:border-accent'
                                        : 'hover:text-accent'
                                }`}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}
