'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, LogOut, Menu, UserRound, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'inicio' },
  { href: '/matches?status=IN_PLAY', label: 'en vivo', live: true },
  { href: '/matches', label: 'partidos' },
  { href: '/bracket', label: 'bracket' },
  { href: '/groups', label: 'grupos' },
  { href: '/teams', label: 'equipos' },
  { href: '/stats', label: 'stats' },
  { href: '/predictions', label: 'predicciones' },
  { href: '/compare', label: 'comparar' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href.split('?')[0])

  const navLinkClass = 'group relative shrink-0 px-1 py-2 font-mono text-[11px] tracking-[.12em] uppercase text-gray-300 transition-colors duration-300 hover:text-white'
  const activeClass = 'text-white'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-[var(--b2)]/45 transition-all duration-300',
        isScrolled ? 'bg-[var(--brand-navy)]/90 backdrop-blur-xl' : 'bg-[var(--brand-navy)]/70 backdrop-blur-md',
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(92deg,rgba(255,77,66,.18),rgba(58,168,255,.16)_32%,transparent_72%)]" />

      <div className="relative mx-auto flex h-16 max-w-[1360px] items-center px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-[1px] font-display text-[30px] leading-none tracking-[.04em] transition-opacity hover:opacity-90"
        >
          <span className="text-[var(--text)]">O</span>
          <span className="text-[var(--text2)]">11</span>
          <span className="text-[var(--brand-cyan)]">CE</span>
          <span className="ml-2 hidden rounded-full border border-[var(--b2)]/60 bg-[var(--brand-navy)]/70 px-2 py-[3px] font-mono text-[8px] tracking-[.12em] text-[var(--text2)] lg:inline-flex">
            mundial 2026
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(navLinkClass, isActive(link.href) && activeClass, link.live && 'flex items-center gap-[6px]')}
            >
              {link.live ? (
                <span
                  className="relative z-[1] h-[6px] w-[6px] shrink-0 rounded-full bg-live broadcast-dot"
                />
              ) : null}
              <span className="relative z-[1]">{link.label}</span>
              <span
                className={cn(
                  'pointer-events-none absolute bottom-[3px] left-2 right-2 h-[1px] origin-left bg-[var(--brand-cyan)] transition-transform duration-300',
                  isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--b2)]/65 bg-[var(--s2)]/70 text-[var(--text2)] transition-colors hover:border-[var(--brand-cyan)] hover:text-[var(--text)]"
            aria-label="notificaciones"
          >
            <Bell size={15} />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--b2)]/65 bg-[var(--s2)]/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:border-[var(--brand-cyan)] hover:text-[var(--text)]"
            aria-label="perfil de usuario"
          >
            <UserRound size={14} />
            perfil
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--b2)]/65 bg-[var(--s2)]/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:border-[var(--brand-red)] hover:text-[#ff877f]"
            aria-label="cerrar sesion"
          >
            <LogOut size={14} />
            cerrar sesión
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--b2)]/65 bg-[var(--s2)]/70 text-[var(--text2)] transition-colors hover:border-[var(--brand-cyan)] hover:text-[var(--text)] md:hidden"
          aria-label="abrir menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-[var(--b2)]/40 bg-[var(--brand-navy)]/95 transition-all duration-300',
          open ? 'max-h-[70dvh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-4 py-4">
          <nav className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-[6px] px-2 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:text-[var(--text)]',
                  isActive(link.href) && 'text-[var(--text)]',
                )}
              >
                {link.live ? (
                  <span
                    className="h-[6px] w-[6px] shrink-0 rounded-full bg-live broadcast-dot"
                  />
                ) : null}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex items-center justify-between border-t border-[var(--b2)]/40 pt-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:text-[var(--text)]"
            >
              <Bell size={14} />
              notifs
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:text-[var(--text)]"
            >
              <UserRound size={14} />
              perfil
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--text2)] transition-colors hover:text-[#ff877f]"
            >
              <LogOut size={14} />
              salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
