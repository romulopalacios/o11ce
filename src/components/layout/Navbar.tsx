'use client'

import Link from 'next/link'
import { Menu, X, Trophy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
    { href: '/teams', label: 'Equipos', testId: 'navbar-link-teams', colorClass: 'bg-emerald-500' },
    { href: '/predictions', label: 'Predictions', testId: 'navbar-link-predictions', colorClass: 'bg-zinc-100' },
    { href: '/compare', label: 'Compare', testId: 'navbar-link-compare', colorClass: 'bg-purple-500' },
]

export default function Navbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <header className="sticky top-0 z-50 h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Principal */}
                <Link
                    href="/"
                    data-testid="navbar-logo"
                    className="group inline-flex items-center gap-2 rounded-md transition-all hover:scale-105 active:scale-95"
                    aria-label="Ir al inicio"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 border border-zinc-700/50 shadow-sm transition-all group-hover:bg-zinc-800 group-hover:border-zinc-500 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                        <Trophy className="h-4 w-4 text-zinc-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-display text-base font-bold tracking-widest text-zinc-100">
                        O11CE
                    </span>
                </Link>

                {/* Navegacion Desktop */}
                <nav className="hidden items-center gap-1 md:flex relative" aria-label="Navegacion principal">
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
                                        ? 'text-zinc-50'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                                )}
                                aria-current={isCurrent ? 'page' : undefined}   
                            >
                                <span className="relative z-10">{item.label}</span>
                                {isCurrent && mounted && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 z-0 rounded-md bg-zinc-900/80 border border-zinc-800/80"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    >
                                        <div className={cn("absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full", item.colorClass)} />
                                    </motion.div>
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white hover:scale-105 active:scale-95 md:hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isMobileMenuOpen ? "close" : "menu"}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.15 }}
                        >
                            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </div>

            {/* Menu movil */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute left-0 top-14 w-full overflow-hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md md:hidden"
                    >
                        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Navegacion movil">
                            {navLinks.map((item, i) => {
                                const isCurrent = isActive(item.href)
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            data-testid={`${item.testId}-mobile`}       
                                            onClick={() => setIsMobileMenuOpen(false)}  
                                            className={cn(
                                                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all active:scale-95',
                                                isCurrent
                                                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-50'        
                                                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                                            )}
                                            aria-current={isCurrent ? 'page' : undefined}
                                        >
                                            <span className={cn("h-1.5 w-1.5 rounded-full transition-transform", isCurrent ? "scale-125 " + item.colorClass : "bg-zinc-700")} />
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
