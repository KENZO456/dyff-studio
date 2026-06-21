'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'HOME',        href: '/'           },
  { label: 'BOOKS',       href: '/books'       },
  { label: 'AUDIO',       href: '/audio'       },
  { label: 'ANIMATIONS',  href: '/animations'  },
  { label: 'MARKETPLACE', href: '/marketplace' },
]

const overlayVariants = {
  initial: { y: '-100%' },
  animate: { y: '0%',    transition: { duration: 0.52, ease: [0.76, 0, 0.24, 1] as const } },
  exit:    { y: '-100%', transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1] as const } },
}

const listVariants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 as const } },
}

const itemVariants = {
  initial: { y: 52,  opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1] as const } },
  exit:    { y: -28, opacity: 0, transition: { duration: 0.2 } },
}

export default function Navbar() {
  const navRef   = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close overlay on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Scroll → glass header (GSAP height tween + CSS class for backdrop-filter)
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const update = () => {
      const scrolled = window.scrollY > 30
      gsap.to(nav, { height: scrolled ? 60 : 80, duration: 0.35, ease: 'power2.out', overwrite: true })
      nav.classList.toggle('nav-scrolled', scrolled)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      <nav ref={navRef} className="navbar" aria-label="Main navigation">
        {/* ── Logo ────────────────────────── */}
        <Link href="/" className="navbar-logo" aria-label="DYFF Studios home">
          <div className="navbar-logo-clip">
            <Image
              src="/Images/LOGO.png"
              alt="DYFF Studios"
              width={130}
              height={52}
              className="h-10 w-auto max-w-none"
              priority
            />
          </div>
        </Link>

        {/* ── Desktop links ───────────────── */}
        <ul className="navbar-links" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link href={href} className={`nav-link ink-flood-up${active ? ' nav-link-active' : ''}`}>
                  <span className="nav-link-text">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* ── Hamburger (mobile) ─────────── */}
        <button
          type="button"
          className="navbar-hamburger"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open ? 'true' : 'false'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile fullscreen overlay ───── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.ul
              className="nav-overlay-list"
              variants={listVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              role="list"
            >
              {NAV_LINKS.map(({ label, href }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <motion.li key={href} variants={itemVariants}>
                    <Link
                      href={href}
                      className={`nav-overlay-link${active ? ' nav-overlay-active' : ''}`}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
