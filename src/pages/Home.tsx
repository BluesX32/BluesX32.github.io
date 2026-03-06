import { Link } from 'react-router-dom'
import siteData from '@/content/site.json'
import configData from '@/content/config.json'
import styles from './Home.module.css'

export default function Home() {
  const { social } = configData

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-name">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <p className={`label ${styles.heroLabel}`}>Biomedical Informatics · Clinical AI</p>
            <h1 id="hero-name" className={styles.heroName}>{siteData.name}</h1>
            <p className={styles.heroTagline}>{siteData.tagline}</p>
            <p className={styles.heroIntro}>{siteData.intro}</p>

            <div className={styles.heroLinks}>
              {configData.cv.path && (
                <a href={configData.cv.path} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  <DocumentIcon />
                  {configData.cv.label}
                </a>
              )}
              {social.scholar && (
                <a href={social.scholar} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                  <ScholarIcon />
                  Google Scholar
                </a>
              )}
              {social.github && (
                <a href={social.github} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon />
                  GitHub
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                  LinkedIn
                </a>
              )}
              {social.email && (
                <a href={`mailto:${social.email}`} className="btn btn-ghost">
                  <EmailIcon />
                  Email
                </a>
              )}
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <HeroSVG />
          </div>
        </div>
      </section>

      {/* Now */}
      <section className={styles.now} aria-labelledby="now-title">
        <div className={styles.nowInner}>
          <div className={styles.nowHeader}>
            <span className="label">Currently</span>
            <h2 id="now-title" className={styles.nowTitle}>Now</h2>
          </div>
          <ul className={styles.nowList} role="list">
            {siteData.now.map((item, i) => (
              <li key={i} className={styles.nowItem}>
                <span className={styles.nowDot} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Navigation cards */}
      <section className={styles.cards} aria-labelledby="cards-title">
        <div className="container">
          <h2 id="cards-title" className="sr-only">Site sections</h2>
          <div className={styles.cardsGrid}>
            <SectionCard
              to="/research"
              label="Research"
              title="Themes & Directions"
              description="The intellectual questions I'm exploring — clinical NLP, decision support, EHR phenotyping, and evaluation."
              icon={<ResearchIcon />}
            />
            <SectionCard
              to="/projects"
              label="Projects"
              title="Case Studies"
              description="Interactive case studies of concrete work — with demos, pipelines, and details on approach."
              icon={<ProjectIcon />}
              featured
            />
            <SectionCard
              to="/publications"
              label="Publications"
              title="Papers & Posters"
              description="Conference papers, journal articles, and posters — searchable and filterable."
              icon={<PubIcon />}
            />
            <SectionCard
              to="/questions"
              label="Questions"
              title="Notebook"
              description="A commonplace book of open questions I keep returning to — about disease, measurement, and clinical meaning."
              icon={<NoteIcon />}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

interface SectionCardProps {
  to: string
  label: string
  title: string
  description: string
  icon: React.ReactNode
  featured?: boolean
}

function SectionCard({ to, label, title, description, icon, featured }: SectionCardProps) {
  return (
    <Link to={to} className={`${styles.sectionCard} ${featured ? styles.sectionCardFeatured : ''}`}>
      <div className={styles.cardIcon} aria-hidden="true">{icon}</div>
      <div className={styles.cardMeta}>
        <span className={`label ${styles.cardLabel}`}>{label}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>
      <span className={styles.cardArrow} aria-hidden="true">→</span>
    </Link>
  )
}

// ----- SVGs -----

function HeroSVG() {
  return (
    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.heroSvg}>
      {/* Outer rings */}
      <circle cx="240" cy="240" r="200" stroke="currentColor" strokeWidth="0.75" opacity="0.12"/>
      <circle cx="240" cy="240" r="150" stroke="currentColor" strokeWidth="0.75" opacity="0.10"/>
      <circle cx="240" cy="240" r="100" stroke="currentColor" strokeWidth="1" opacity="0.12"/>

      {/* Axis lines */}
      <line x1="40" y1="240" x2="440" y2="240" stroke="currentColor" strokeWidth="0.5" opacity="0.08"/>
      <line x1="240" y1="40" x2="240" y2="440" stroke="currentColor" strokeWidth="0.5" opacity="0.08"/>
      <line x1="98" y1="98" x2="382" y2="382" stroke="currentColor" strokeWidth="0.5" opacity="0.06"/>
      <line x1="382" y1="98" x2="98" y2="382" stroke="currentColor" strokeWidth="0.5" opacity="0.06"/>

      {/* Signal / ECG motif */}
      <polyline
        points="40,260 80,260 100,220 120,300 140,180 160,320 180,240 220,240 240,200 260,240 300,240 320,260 340,260 380,260 400,260 440,260"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nodes */}
      <circle cx="140" cy="180" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="240" cy="200" r="5" fill="currentColor" opacity="0.6"/>
      <circle cx="340" cy="260" r="4" fill="currentColor" opacity="0.4"/>

      {/* Center mark */}
      <circle cx="240" cy="240" r="8" fill="currentColor" opacity="0.15"/>
      <circle cx="240" cy="240" r="3" fill="currentColor" opacity="0.5"/>

      {/* Connecting lines (network) */}
      <line x1="140" y1="180" x2="240" y2="200" stroke="currentColor" strokeWidth="0.75" opacity="0.15"/>
      <line x1="240" y1="200" x2="340" y2="260" stroke="currentColor" strokeWidth="0.75" opacity="0.15"/>
      <line x1="140" y1="180" x2="340" y2="260" stroke="currentColor" strokeWidth="0.5" opacity="0.08"/>

      {/* Small data points */}
      {[
        [160, 310], [310, 170], [190, 140], [330, 330],
        [110, 290], [360, 190], [270, 360],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" opacity="0.2"/>
      ))}
    </svg>
  )
}

function DocumentIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
}
function ScholarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>
}
function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
}
function LinkedInIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function EmailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
}
function ResearchIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
}
function ProjectIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
}
function PubIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
}
function NoteIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
