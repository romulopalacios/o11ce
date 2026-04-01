'use client'

import Link from 'next/link'
import { Menu, X, Trophy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavLink {
    href: string
    label: string
    testId: string
    colorClass: string
}

const navLinks: NavLink[] = [
    { href: '/matches', label: 'Matches', testId: 'navbar-link-matches', colorClass: 'bg-blue-500' },
    { href: '/groups', label: 'Groups', testId: 'navbar-link-groups', colorClass: 'bg-green-500' },
    { href: '/bracket', label: 'Bracket', testId: 'navbar-link-bracket', colorClass: 'bg-red-500' },
    { href: '/predictions', label: 'Predictions', testId: 'navbar-link-predictions', colorClass: 'bg-zinc-100' },
]

function Navbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <header className="sticky top-0 z-50 h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Principal */}
                <Link
                    href="/"
                    data-testid="navbar-logo"
                    className="group inline-flex items-center gap-2 rounded-md transition-opacity hover:opacity-80"
                    aria-label="Ir al inicio"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 border border-zinc-800">
                        <Trophy className="h-4 w-4 text-zinc-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-display text-base font-bold tracking-widest text-zinc-100">
                        O11CE
                    </span>
                </Link>

                {/* Navegacion Desktop */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Navegacion principal">
                    {navLinks.map((item) => {
                        const isCurrent = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                data-testid={item.testId}
                                className={cn(
                                    'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                    isCurrent
                                        ? 'bg-zinc-900 text-zinc-50'
                                        : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                                )}
                                aria-current={isCurrent ? 'page' : undefined}
                            >
                                {item.label}
                                {isCurrent && (
                                    <span 
                                        className={cn("absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full", item.colorClass)} 
                                        aria-hidden="true"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Toggle menu movil */}
                <button
                    type="button"
                    data-testid="navbar-menu-toggle"
                    aria-label="Alternar menu movil"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
                >
                    {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {/* Menu movil */}
            {isMobileMenuOpen && (
                <div className="absolute left-0 top-14 w-full border-b border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-1" aria-label="Navegacion movil">
                        {navLinks.map((item) => {
                            const isCurrent = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    data-testid={`${item.testId}-mobile`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isCurrent
                                            ? 'bg-zinc-900 text-zinc-50'
                                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                                    )}
                                    aria-current={isCurrent ? 'page' : undefined}
                                >
                                    <span className={cn("h-1.5 w-1.5 rounded-full", isCurrent ? item.colorClass : "bg-transparent")} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Navbar
