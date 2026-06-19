import Link from 'next/link'
import PortfolioLink from '@/components/ui/PortfolioLink'

// TODO: Replace '#' with actual social media profile URLs
const SOCIAL_LINKS: { label: string; href: string; path: string }[] = [
  {
    label: 'YouTube',
    href:  '#',
    path:  'M23 7s-.3-1.8-1-2.6c-1-.9-2-.9-2.5-1C17 3.3 12 3.3 12 3.3s-5 0-7.5.1C4 3.5 3 3.5 2 4.4 1.3 5.2 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 1.8 1 2.6c1 .9 2.2.8 2.8.9C6.7 21 12 21 12 21s5 0 7.5-.2c.5 0 1.5-.1 2.5-1 .7-.7 1-2.5 1-2.5s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.3l6.7 3.7-6.7 3.6z',
  },
  {
    label: 'Facebook',
    href:  '#',
    path:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Instagram',
    href:  '#',
    path:  'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z',
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

// 8 irregular ink drips along the top edge — fixed x positions, varying height/width
const DRIPS = [
  { x: 85,   h: 38, w: 5 },
  { x: 215,  h: 22, w: 4 },
  { x: 385,  h: 48, w: 6 },
  { x: 555,  h: 29, w: 4 },
  { x: 735,  h: 16, w: 3 },
  { x: 910,  h: 44, w: 5 },
  { x: 1080, h: 20, w: 4 },
  { x: 1265, h: 36, w: 5 },
]

export default function Footer() {
  return (
    <footer className="footer">
      {/* ── Ink drip top-edge ────────────────────────────────────────────── */}
      <svg
        className="footer-drips"
        viewBox="0 0 1400 65"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {DRIPS.map(({ x, h, w }, i) => (
          <g key={i}>
            <rect
              x={x - w / 2}
              y={0}
              width={w}
              height={Math.max(h - w * 1.1, 2)}
              fill="rgba(153,202,69,0.2)"
              rx={w / 2}
            />
            <ellipse
              cx={x}
              cy={h}
              rx={w * 0.9}
              ry={w * 1.4}
              fill="rgba(153,202,69,0.2)"
            />
          </g>
        ))}
      </svg>

      {/* ── 3-column grid ────────────────────────────────────────────────── */}
      <div className="footer-grid">

        {/* LEFT — Brand + tagline */}
        <div>
          <Link href="/" className="footer-brand" aria-label="DYFF Studios home">
            <span className="footer-brand-dyff">DYFF</span>
            <span className="footer-brand-sub">STUDIOS</span>
          </Link>
          <p className="footer-tagline">
            &ldquo;Ideas are ticking time bombs waiting to set off.&rdquo;
          </p>
        </div>

        {/* CENTER — Quick links */}
        <div>
          <p className="footer-heading">Navigation</p>
          <nav aria-label="Footer navigation">
            {QUICK_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT — Social icons */}
        <div>
          <p className="footer-heading">Find Us</p>
          <div className="footer-socials">
            {SOCIAL_LINKS.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                className="footer-social-icon"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom strip ─────────────────────────────────────────────────── */}
      <div className="footer-bottom-wrap">
        <p className="footer-copyright">
          &copy; DYFF Studios Productions. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <PortfolioLink
            href="/kenny"
            className="font-mono text-white text-[0.5rem] tracking-[0.18em] uppercase
              hover:text-ink-green hover:underline underline-offset-4 transition-colors duration-200"
          >
            Site by Kenny Ochonogor
          </PortfolioLink>
          <span className="font-mono text-white/30 text-[0.5rem]">·</span>
          <PortfolioLink
            href="/daniel"
            className="font-mono text-white text-[0.5rem] tracking-[0.18em] uppercase
              hover:text-ink-green hover:underline underline-offset-4 transition-colors duration-200"
          >
            Art by Nobu Savage
          </PortfolioLink>
        </div>
      </div>
    </footer>
  )
}
