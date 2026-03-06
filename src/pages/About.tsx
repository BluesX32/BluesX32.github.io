import siteData from '@/content/site.json'
import styles from './About.module.css'

export default function About() {
  const { about } = siteData

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">About</span>
          <h1 className="section-title">A little about me</h1>
        </header>

        <div className={styles.layout}>
          <div className={styles.mainCol}>
            {/* Bio */}
            <section className={styles.section} aria-labelledby="bio-heading">
              <h2 id="bio-heading" className={styles.sectionHeading}>Background</h2>
              <p className={styles.prose}>{about.bio}</p>
            </section>

            {/* Philosophy */}
            <section className={styles.section} aria-labelledby="philosophy-heading">
              <h2 id="philosophy-heading" className={styles.sectionHeading}>What I'm building toward</h2>
              <p className={styles.prose}>{about.philosophy}</p>
            </section>

            {/* Outside */}
            <section className={styles.section} aria-labelledby="outside-heading">
              <h2 id="outside-heading" className={styles.sectionHeading}>Outside of research</h2>
              <p className={styles.prose}>{about.outside}</p>
            </section>
          </div>

          <aside className={styles.sideCol}>
            {/* Values */}
            <div className={styles.valuesCard}>
              <h2 className={styles.valuesHeading}>Values</h2>
              <ul className={styles.valuesList} role="list">
                {about.values.map((v, i) => (
                  <li key={i} className={styles.valuesItem}>
                    <span className={styles.valuesDot} aria-hidden="true" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative SVG */}
            <div className={styles.decorSvg} aria-hidden="true">
              <AboutSVG />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function AboutSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', color: 'var(--accent-primary)' }}>
      {/* Abstract person/body motif — simple, restrained */}
      <circle cx="100" cy="60" r="20" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <path d="M70 130 Q100 90 130 130" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15"/>
      <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.75" opacity="0.08"/>
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.06"/>

      {/* ECG-like line */}
      <polyline
        points="20,150 40,150 50,130 60,170 70,110 80,160 100,150 120,150 130,140 140,150 160,150 180,150"
        stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Dots */}
      {[[70,110],[100,150],[130,140]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.3"/>
      ))}
    </svg>
  )
}
