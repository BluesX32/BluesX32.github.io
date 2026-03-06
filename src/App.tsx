import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import EnvelopeIntro from '@/components/EnvelopeIntro'

// Lazy-load pages for better performance
const Home         = lazy(() => import('@/pages/Home'))
const Research     = lazy(() => import('@/pages/Research'))
const Publications = lazy(() => import('@/pages/Publications'))
const Projects     = lazy(() => import('@/pages/Projects'))
const CV           = lazy(() => import('@/pages/CV'))
const About        = lazy(() => import('@/pages/About'))
const Questions    = lazy(() => import('@/pages/Questions'))
const Contact      = lazy(() => import('@/pages/Contact'))

const SESSION_KEY = 'envelope_seen'

function PageFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--text-tertiary)',
      fontSize: 'var(--text-sm)',
    }}>
      Loading…
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // Show envelope intro only on home, once per session
  const isHome = location.pathname === '/'
  const alreadySeen = Boolean(sessionStorage.getItem(SESSION_KEY))
  const [showIntro, setShowIntro] = useState(isHome && !alreadySeen)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Skip-to-content on route change
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (main) main.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {showIntro && (
        <EnvelopeIntro onComplete={() => setShowIntro(false)} />
      )}

      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/research"     element={<Research />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/projects"     element={<Projects />} />
            <Route path="/cv"           element={<CV />} />
            <Route path="/about"        element={<About />} />
            <Route path="/questions"    element={<Questions />} />
            <Route path="/contact"      element={<Contact />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  )
}

function NotFound() {
  return (
    <div className="page-content" style={{ textAlign: 'center', paddingTop: '20vh' }}>
      <p className="label" style={{ marginBottom: '1rem' }}>404</p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
        Page not found
      </h1>
      <a href="/" className="btn btn-primary">
        Go home
      </a>
    </div>
  )
}
