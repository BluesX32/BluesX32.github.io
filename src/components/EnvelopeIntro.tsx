import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './EnvelopeIntro.module.css'

const SESSION_KEY = 'envelope_seen'

interface EnvelopeIntroProps {
  onComplete: () => void
}

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('opening')
    sessionStorage.setItem(SESSION_KEY, '1')

    const delay = reducedMotion ? 100 : 900
    setTimeout(() => {
      setPhase('done')
      setTimeout(onComplete, reducedMotion ? 50 : 300)
    }, delay)
  }, [phase, reducedMotion, onComplete])

  const handleSkip = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    sessionStorage.setItem(SESSION_KEY, '1')
    setPhase('done')
    setTimeout(onComplete, 50)
  }, [onComplete])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleOpen()
      if (e.key === 'Escape') {
        sessionStorage.setItem(SESSION_KEY, '1')
        setPhase('done')
        setTimeout(onComplete, 50)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleOpen, onComplete])

  return (
    <div
      className={`${styles.wrapper} ${phase === 'opening' ? styles.opening : ''} ${phase === 'done' ? styles.done : ''}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Open envelope to enter the website"
    >
      {/* Paper texture overlay */}
      <div className={styles.paperTexture} aria-hidden="true" />

      {/* Envelope body */}
      <div className={styles.envelope} aria-hidden="true">
        {/* Back face */}
        <div className={styles.envelopeBack} />

        {/* Bottom triangle fold lines */}
        <div className={styles.foldLeft} />
        <div className={styles.foldRight} />
        <div className={styles.foldBottom} />

        {/* Flap (top) */}
        <div className={`${styles.flap} ${phase === 'opening' ? styles.flapOpen : ''}`}>
          <div className={styles.flapInner}>
            <RodOfAsclepius />
          </div>
        </div>

        {/* Paper content (reveals on open) */}
        <div className={`${styles.paper} ${phase === 'opening' ? styles.paperReveal : ''}`}>
          <div className={styles.paperLines}>
            <div className={styles.paperLine} />
            <div className={styles.paperLine} />
            <div className={styles.paperLine} style={{ width: '60%' }} />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className={`${styles.hint} ${phase !== 'idle' ? styles.hintHide : ''}`} aria-live="polite">
        Click anywhere to open
      </p>

      {/* Skip */}
      <button
        className={styles.skip}
        onClick={handleSkip}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSkip(e) }}
        tabIndex={0}
        aria-label="Skip intro"
      >
        Skip intro
      </button>

      {/* Abstract background SVG */}
      <svg
        className={styles.bgSvg}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="300" cy="300" r="240" stroke="#1a3a5c" strokeWidth="0.5" strokeOpacity="0.1"/>
        <circle cx="300" cy="300" r="180" stroke="#1a3a5c" strokeWidth="0.5" strokeOpacity="0.08"/>
        <circle cx="300" cy="300" r="120" stroke="#1a3a5c" strokeWidth="0.5" strokeOpacity="0.06"/>
        <line x1="60" y1="300" x2="540" y2="300" stroke="#1a3a5c" strokeWidth="0.5" strokeOpacity="0.06"/>
        <line x1="300" y1="60" x2="300" y2="540" stroke="#1a3a5c" strokeWidth="0.5" strokeOpacity="0.06"/>
      </svg>
    </div>
  )
}

function RodOfAsclepius() {
  return (
    <svg
      width="52"
      height="80"
      viewBox="0 0 52 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rod of Asclepius"
    >
      {/* Staff */}
      <line x1="26" y1="6" x2="26" y2="74" stroke="#1a3a5c" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Serpent body — sinusoidal path around staff */}
      <path
        d="M26 14
           C 38 18, 38 26, 26 28
           C 14 30, 14 38, 26 40
           C 38 42, 38 50, 26 52
           C 14 54, 14 62, 26 64"
        stroke="#2563a0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Serpent head */}
      <ellipse cx="28" cy="11" rx="5" ry="3.5" fill="#2563a0" transform="rotate(-20 28 11)"/>
      <circle cx="30.5" cy="9.5" r="0.8" fill="#fff"/>

      {/* Serpent tongue */}
      <path d="M32 10 L35 9 M35 9 L37 8 M35 9 L36 11" stroke="#2563a0" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  )
}
