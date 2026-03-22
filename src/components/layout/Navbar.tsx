'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',            label: 'inicio'       },
  { href: '/matches',     label: 'partidos'     },
  { href: '/bracket',     label: 'bracket'      },
  { href: '/groups',      label: 'grupos'       },
  { href: '/teams',       label: 'equipos'      },
  { href: '/stats',       label: 'stats'        },
  { href: '/predictions', label: 'predicciones' },
  { href: '/compare',     label: 'comparar'     },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    if (open) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 border-b border-b1/80 bg-bg/85 backdrop-blur-md"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group inline-flex items-center gap-2 font-display text-[23px] leading-none tracking-[.05em]"
        >
          <span className="relative">
            O<span className="text-ac">11</span>CE
            <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-ac/80 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
          <span className="hidden md:inline-flex rounded-full border border-b2 px-2 py-[3px] font-mono text-[8px] tracking-[.14em] text-t3 uppercase">
            mundial 2026
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              onClick={() => setOpen(false)}
                  className={cn(
                    'font-mono text-[10px] tracking-[.11em] uppercase',
                    'px-[10px] py-[6px] rounded-full border',
                    'transition-all duration-150',
                    isActive(l.href)
                      ? 'border-ac/35 bg-ac/12 text-ac'
                      : 'border-transparent text-t3 hover:text-t2 hover:border-b2/80 hover:bg-s1'
                  )}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 -mr-2 flex flex-col gap-[5px]"
          onClick={() => setOpen(p => !p)}
          aria-label="menú"
          aria-expanded={open}
        >
          {[0,1,2].map(i => (
            <span key={i} className={cn(
              'block w-[18px] h-[1.5px] bg-t2 rounded-full',
              'transition-all duration-200 origin-center',
              i === 0 && open && 'rotate-45 translate-y-[6.5px]',
              i === 1 && open && 'opacity-0 scale-x-0',
              i === 2 && open && '-rotate-45 -translate-y-[6.5px]',
            )} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden absolute top-full left-0 right-0 z-50',
        'bg-s1/95 backdrop-blur-md border-b border-b1',
        'transition-all duration-200 overflow-hidden',
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      )}>
        <nav className="px-6 py-3 flex flex-col">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              onClick={() => setOpen(false)}
                  className={cn(
                    'py-3 font-mono text-[11px] tracking-[.1em] uppercase',
                    'border-b border-b1 last:border-0',
                    'transition-colors duration-100',
                    isActive(l.href) ? 'text-ac' : 'text-t2'
                  )}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-14 bg-bg/80 -z-10"
             onClick={() => setOpen(false)} />
      )}
    </header>
  )
}
