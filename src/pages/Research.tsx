import researchData from '@/content/research.json'
import styles from './Research.module.css'

const iconMap: Record<string, React.ReactNode> = {
  nlp:      <NLPIcon />,
  decision: <DecisionIcon />,
  data:     <DataIcon />,
  eval:     <EvalIcon />,
  causal:   <CausalIcon />,
}

export default function Research() {
  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Research</span>
          <h1 className="section-title">Themes &amp; Directions</h1>
          <p className="section-subtitle">
            These are the areas I keep returning to — the questions that shape how I think about
            clinical data, computational methods, and what it means for research to matter in practice.
            None of these are closed; all are genuinely open.
          </p>
        </header>

        <div className={styles.themes}>
          {researchData.map((theme, idx) => (
            <article
              key={theme.id}
              className={`${styles.themeCard} ${idx % 2 === 1 ? styles.themeCardAlt : ''}`}
              aria-labelledby={`theme-${theme.id}`}
            >
              <div className={styles.themeIndex} aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className={styles.themeIcon} aria-hidden="true">
                {iconMap[theme.icon] ?? <DefaultIcon />}
              </div>

              <div className={styles.themeBody}>
                <h2 id={`theme-${theme.id}`} className={styles.themeTitle}>
                  {theme.title}
                </h2>

                <p className={styles.themeDesc}>{theme.description}</p>

                <div className={styles.themeMeta}>
                  <div className={styles.metaGroup}>
                    <span className="label">Methods</span>
                    <div className={styles.methodTags}>
                      {theme.methods.map(m => (
                        <span key={m} className="tag">{m}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.metaGroup}>
                    <span className="label">Why it matters</span>
                    <p className={styles.whyText}>{theme.whyItMatters}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing note */}
        <aside className={styles.closing}>
          <ResearchDiagramSVG />
          <p>
            These themes overlap and intersect — that's intentional. The most interesting problems
            tend to live at their edges: between NLP and causal inference, between evaluation and
            ethics, between what models can measure and what clinicians actually need.
          </p>
        </aside>
      </div>
    </div>
  )
}

function ResearchDiagramSVG() {
  return (
    <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.closingDiagram} aria-hidden="true">
      {[40, 110, 180, 250, 320].map((x, i) => (
        <g key={i}>
          <circle cx={x - 80 + 80} cy="40" r="28" stroke="currentColor" strokeWidth="1" opacity={0.15 + i * 0.06}/>
          {i < 4 && <line x1={x - 80 + 108} y1="40" x2={x - 80 + 152} y2="40" stroke="currentColor" strokeWidth="0.75" opacity="0.15"/>}
        </g>
      ))}
      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="110" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="180" cy="40" r="4" fill="currentColor" opacity="0.5"/>
      <circle cx="250" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="320" cy="40" r="4" fill="currentColor" opacity="0.4"/>
    </svg>
  )
}

// ---- Icons ----
function NLPIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="6" width="28" height="20" rx="3"/>
      <line x1="9" y1="13" x2="27" y2="13"/>
      <line x1="9" y1="18" x2="27" y2="18"/>
      <line x1="9" y1="23" x2="19" y2="23"/>
      <path d="M24 27l2 3 2-3"/>
    </svg>
  )
}
function DecisionIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="7" r="4"/>
      <circle cx="8" cy="26" r="4"/>
      <circle cx="28" cy="26" r="4"/>
      <line x1="18" y1="11" x2="13" y2="22"/>
      <line x1="18" y1="11" x2="23" y2="22"/>
    </svg>
  )
}
function DataIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="18" cy="10" rx="12" ry="5"/>
      <path d="M6 10v8c0 2.76 5.37 5 12 5s12-2.24 12-5v-8"/>
      <path d="M6 18v8c0 2.76 5.37 5 12 5s12-2.24 12-5v-8"/>
    </svg>
  )
}
function EvalIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4,28 12,18 18,22 24,12 32,8"/>
      <circle cx="32" cy="8" r="3"/>
      <circle cx="12" cy="18" r="2"/>
      <circle cx="24" cy="12" r="2"/>
    </svg>
  )
}
function CausalIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="18" r="4"/>
      <circle cx="28" cy="10" r="4"/>
      <circle cx="28" cy="26" r="4"/>
      <line x1="12" y1="16" x2="24" y2="12"/>
      <line x1="12" y1="20" x2="24" y2="24"/>
      <path d="M20 12 L24 12 L22 10 M20 24 L24 24 L22 26"/>
    </svg>
  )
}
function DefaultIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="18" cy="18" r="12"/>
      <circle cx="18" cy="18" r="4"/>
    </svg>
  )
}
