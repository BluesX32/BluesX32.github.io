import configData from '@/content/config.json'
import siteData from '@/content/site.json'
import styles from './Contact.module.css'

export default function Contact() {
  const { social, scheduling } = configData

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Get in touch</span>
          <h1 className="section-title">Contact</h1>
          <p className="section-subtitle">
            I'm happy to connect with potential mentors, collaborators, or anyone thinking about
            similar questions. The best way to reach me is email.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.mainCol}>
            {/* Email */}
            <section className={styles.contactSection} aria-labelledby="email-heading">
              <h2 id="email-heading" className={styles.sectionHeading}>Email</h2>
              <a href={`mailto:${social.email}`} className={styles.emailLink}>
                {social.email}
              </a>
              <p className={styles.sectionNote}>
                I typically respond within a day or two. For longer conversations,
                feel free to schedule time below.
              </p>
            </section>

            {/* Scheduling */}
            <section className={styles.contactSection} aria-labelledby="schedule-heading">
              <h2 id="schedule-heading" className={styles.sectionHeading}>Schedule a meeting</h2>
              <p className={styles.sectionNote}>
                If you'd like to discuss research directions, potential collaboration, or just
                have a conversation — you're welcome to schedule time directly.
              </p>

              {scheduling.calendlyUrl ? (
                <div className={styles.calendlyWrap}>
                  <iframe
                    src={scheduling.calendlyUrl}
                    title="Schedule a meeting"
                    className={styles.calendlyEmbed}
                    frameBorder="0"
                    scrolling="no"
                    aria-label="Calendly scheduling widget"
                  />
                </div>
              ) : (
                <div className={styles.schedulingPlaceholder}>
                  <CalendarIcon />
                  <p>Scheduling not yet configured.</p>
                  <p className={styles.placeholderHint}>
                    Add your Calendly URL to <code>src/content/config.json</code>.
                  </p>
                  <a href={`mailto:${social.email}`} className="btn btn-primary">
                    Email to arrange a time
                  </a>
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <aside className={styles.sideCol}>
            <div className={styles.socialCard}>
              <h2 className={styles.socialHeading}>Also find me at</h2>
              <div className={styles.socialLinks}>
                {social.github && (
                  <SocialLink href={social.github} icon={<GitHubIcon />} label="GitHub" sublabel="@BluesX32" />
                )}
                {social.linkedin && (
                  <SocialLink href={social.linkedin} icon={<LinkedInIcon />} label="LinkedIn" sublabel={siteData.name} />
                )}
                {social.scholar && (
                  <SocialLink href={social.scholar} icon={<ScholarIcon />} label="Google Scholar" sublabel="Publications" />
                )}

              </div>
            </div>

            <div className={styles.noteCard}>
              <p className={styles.noteText}>
                I'm currently open to conversations about PhD programs, research collaborations,
                and interesting questions at the intersection of clinical informatics and AI.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  sublabel: string
}

function SocialLink({ href, icon, label, sublabel }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialLink}
      aria-label={`${label}: ${sublabel}`}
    >
      <span className={styles.socialIcon}>{icon}</span>
      <span className={styles.socialText}>
        <span className={styles.socialLabel}>{label}</span>
        <span className={styles.socialSublabel}>{sublabel}</span>
      </span>
      <span className={styles.socialArrow} aria-hidden="true">↗</span>
    </a>
  )
}

function GitHubIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
}
function LinkedInIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}
function ScholarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>
}

function CalendarIcon() {
  return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" opacity="0.3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
