import configData from '@/content/config.json'
import styles from './CV.module.css'

export default function CV() {
  const { cv } = configData

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Curriculum Vitae</span>
          <h1 className="section-title">CV</h1>
        </header>

        <div className={styles.toolbar}>
          <a
            href={cv.path}
            download
            className="btn btn-primary"
            aria-label="Download CV as PDF"
          >
            <DownloadIcon />
            {cv.label}
          </a>
          <a
            href={cv.path}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            aria-label="Open CV in new tab"
          >
            <OpenIcon />
            Open in new tab
          </a>
        </div>

        <div className={styles.viewerWrap}>
          {cv.path ? (
            <object
              data={cv.path}
              type="application/pdf"
              className={styles.pdfObject}
              title="Curriculum Vitae"
              aria-label="CV PDF viewer"
            >
              <div className={styles.fallback}>
                <p>Your browser cannot display the PDF inline.</p>
                <a href={cv.path} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  <OpenIcon />
                  Open CV
                </a>
              </div>
            </object>
          ) : (
            <div className={styles.placeholder}>
              <FileIcon />
              <p>CV file not yet configured.</p>
              <p className={styles.placeholderHint}>
                Add your CV to <code>public/cv/cv.pdf</code> and update <code>config.json</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
}
function OpenIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
function FileIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" opacity="0.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
}
