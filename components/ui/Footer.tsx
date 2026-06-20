import Link from 'next/link'
import PortfolioLink from '@/components/ui/PortfolioLink'

const SOCIAL_LINKS: { label: string; href: string; path: string }[] = [
  {
    label: 'YouTube',
    href:  '#',
    path:  'M23 7s-.3-1.8-1-2.6c-1-.9-2-.9-2.5-1C17 3.3 12 3.3 12 3.3s-5 0-7.5.1C4 3.5 3 3.5 2 4.4 1.3 5.2 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 1.8 1 2.6c1 .9 2.2.8 2.8.9C6.7 21 12 21 12 21s5 0 7.5-.2c.5 0 1.5-.1 2.5-1 .7-.7 1-2.5 1-2.5s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.3l6.7 3.7-6.7 3.6z',
  },
  {
    label: 'Instagram',
    href:  '#',
    path:  'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z',
  },
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/in/dyff-studio-4703bb402/',
    path:  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
  {
    label: 'Webnovel',
    href:  '#',
    path:  'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
  },
]

const QUICK_LINKS = [
  { label: 'Home',        href: '/'           },
  { label: 'Books',       href: '/books'       },
  { label: 'Audio',       href: '/audio'       },
  { label: 'Animations',  href: '/animations'  },
  { label: 'Marketplace', href: '/marketplace' },
]

export default function Footer() {
  return (
    <footer className="footer-new">

      {/* ── 3-column grid ─────────────────────────────────────────────── */}
      <div className="footer-new-grid">

        {/* LEFT — Brand */}
        <div>
          <Link href="/" aria-label="DYFF Studios home">
            <span className="font-thunder uppercase text-white leading-none block"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 400 }}>
              DYFF
            </span>
            <span className="font-thunder uppercase text-white/40 tracking-[0.25em] block"
              style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)', fontWeight: 400 }}>
              STUDIOS
            </span>
          </Link>
          <p className="font-thunder uppercase text-white/50 mt-5 leading-snug"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 0.95rem)', fontWeight: 400 }}>
            &ldquo;Ideas are ticking time bombs<br />waiting to set off.&rdquo;
          </p>
        </div>

        {/* CENTER — Quick links */}
        <div>
          <p className="font-thunder uppercase text-white/40 tracking-[0.25em] mb-5"
            style={{ fontSize: '0.6rem', fontWeight: 400 }}>
            Navigation
          </p>
          <nav aria-label="Footer navigation" className="flex flex-col gap-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-thunder uppercase text-white hover:text-ink-green
                  transition-colors duration-200 leading-none"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 400 }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT — Social */}
        <div>
          <p className="font-thunder uppercase text-white/40 tracking-[0.25em] mb-5"
            style={{ fontSize: '0.6rem', fontWeight: 400 }}>
            Find Us
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 font-thunder uppercase text-white/70
                  hover:text-white transition-colors duration-200"
                style={{ fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)', fontWeight: 400 }}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <path d={path} />
                </svg>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="footer-new-divider" />

      {/* ── Bottom strip ──────────────────────────────────────────────── */}
      <div className="footer-new-bottom">
        <p className="font-thunder uppercase text-white/40"
          style={{ fontSize: '0.6rem', fontWeight: 400, letterSpacing: '0.18em' }}>
          &copy; {new Date().getFullYear()} DYFF Studios Productions. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <PortfolioLink
            href="/kenny"
            className="font-thunder uppercase text-[0.6rem] tracking-[0.18em] font-normal
              text-white hover:text-ink-green transition-colors duration-200"
          >
            Site by Kenny Ochonogor
          </PortfolioLink>
          <span className="font-thunder text-white/20 text-[0.6rem]">·</span>
          <PortfolioLink
            href="/daniel"
            className="font-thunder uppercase text-[0.6rem] tracking-[0.18em] font-normal
              text-white hover:text-ink-green transition-colors duration-200"
          >
            Art by Nobu Savage
          </PortfolioLink>
        </div>
      </div>

    </footer>
  )
}
