import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/transactions', label: 'Transactions' },
        { path: '/analytics', label: 'Analytics' },
        { path: '/settings', label: 'Settings' },
        { path: '/add-transaction', label: 'Add Transaction' },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <header className="md:flex md:justify-between md:items-end border-b border-b-color">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Expense Tracker</h2>

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
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 md:py-0 transition-colors ${
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
