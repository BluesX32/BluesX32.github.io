import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDarkMode } from '@/hooks/useDarkMode'
import siteData from '@/content/site.json'
import styles from './Nav.module.css'

const navLinks = [
  { to: '/',            label: 'Home',         exact: true  },
  { to: '/research',    label: 'Research',     exact: false },
  { to: '/publications',label: 'Publications', exact: false },
  { to: '/projects',    label: 'Projects',     exact: false },
  { to: '/cv',          label: 'CV',           exact: false },
  { to: '/about',       label: 'About',        exact: false },
  { to: '/questions',   label: 'Questions',    exact: false },
  { to: '/contact',     label: 'Contact',      exact: false },
]

export default function Nav() {
  const { isDark, toggle } = useDarkMode()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.inner}>
        <NavLink to="/" className={styles.wordmark} aria-label="Home">
          <span className={styles.wordmarkName}>{siteData.nameShort}</span>
          <span className={styles.wordmarkDot} aria-hidden="true">·</span>
        </NavLink>

        <nav className={styles.links} aria-label="Primary navigation">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )}
          </button>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.mobileActions}>
          <button
            className={styles.themeToggleMobile}
            onClick={toggle}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/>
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/>
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
