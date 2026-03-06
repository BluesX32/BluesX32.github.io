import { useState, useMemo, useRef } from 'react'
import pubsData from '@/content/publications.json'
import styles from './Publications.module.css'

type PubType = 'all' | 'journal' | 'conference' | 'poster' | 'preprint'

const TYPE_LABELS: Record<string, string> = {
  journal:    'Journal',
  conference: 'Conference',
  poster:     'Poster',
  preprint:   'Preprint',
}

export default function Publications() {
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<PubType>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const years = useMemo(() => {
    const ys = [...new Set(pubsData.map(p => p.year))].sort((a, b) => b - a)
    return ys
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return pubsData.filter(p => {
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.join(' ').toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q)
      const matchYear = yearFilter === 'all' || String(p.year) === yearFilter
      const matchType = typeFilter === 'all' || p.type === typeFilter
      return matchSearch && matchYear && matchType
    })
  }, [search, yearFilter, typeFilter])

  const grouped = useMemo(() => {
    const groups: Record<number, typeof pubsData> = {}
    for (const pub of filtered) {
      if (!groups[pub.year]) groups[pub.year] = []
      groups[pub.year].push(pub)
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, pubs]) => ({ year: Number(year), pubs }))
  }, [filtered])

  const copyBibtex = (pub: typeof pubsData[0]) => {
    navigator.clipboard.writeText(pub.bibtex).then(() => {
      setCopiedId(pub.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Academic work</span>
          <h1 className="section-title">Publications</h1>
          <p className="section-subtitle">
            Papers, conference presentations, and posters. Search by keyword, filter by year or type.
          </p>
        </header>

        {/* Controls */}
        <div className={styles.controls} role="search">
          <div className={styles.searchWrap}>
            <SearchIcon />
            <input
              ref={searchRef}
              type="search"
              className={styles.searchInput}
              placeholder="Search by title, author, venue…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search publications"
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => { setSearch(''); searchRef.current?.focus() }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.filters} role="group" aria-label="Filter publications">
            <select
              className={styles.select}
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              aria-label="Filter by year"
            >
              <option value="all">All years</option>
              {years.map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>

            <div className={styles.typeFilters}>
              {(['all', 'journal', 'conference', 'poster'] as PubType[]).map(t => (
                <button
                  key={t}
                  className={`${styles.typeBtn} ${typeFilter === t ? styles.typeBtnActive : ''}`}
                  onClick={() => setTypeFilter(t)}
                  aria-pressed={typeFilter === t}
                >
                  {t === 'all' ? 'All' : TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className={styles.resultCount} aria-live="polite">
          {filtered.length === pubsData.length
            ? `${pubsData.length} publications`
            : `${filtered.length} of ${pubsData.length} publications`}
        </p>

        {/* Publication list */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No publications match your search.</p>
            <button className="btn btn-ghost" onClick={() => { setSearch(''); setYearFilter('all'); setTypeFilter('all') }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles.groups}>
            {grouped.map(({ year, pubs }) => (
              <section key={year} className={styles.yearGroup} aria-labelledby={`year-${year}`}>
                <h2 id={`year-${year}`} className={styles.yearHeading}>{year}</h2>
                <ul className={styles.pubList} role="list">
                  {pubs.map(pub => (
                    <li key={pub.id} className={styles.pubItem}>
                      <div className={styles.pubHeader}>
                        <span className={`tag ${styles.typeTag}`}>
                          {TYPE_LABELS[pub.type] ?? pub.type}
                        </span>
                        <span className={styles.pubVenue}>{pub.venue}</span>
                      </div>

                      <h3 className={styles.pubTitle}>{pub.title}</h3>

                      <p className={styles.pubAuthors}>
                        {pub.authors.map((a, i) => (
                          <span key={i}>
                            <span className={a.toLowerCase().includes('your name') ? styles.selfAuthor : ''}>
                              {a}
                            </span>
                            {i < pub.authors.length - 1 && ', '}
                          </span>
                        ))}
                      </p>

                      {pub.abstract && (
                        <details className={styles.abstractDetails}>
                          <summary className={styles.abstractToggle}>Abstract</summary>
                          <p className={styles.abstractText}>{pub.abstract}</p>
                        </details>
                      )}

                      <div className={styles.pubLinks}>
                        {pub.links.pdf && (
                          <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 'var(--text-xs)' }}>
                            <PDFIcon /> PDF
                          </a>
                        )}
                        {pub.links.doi && (
                          <a href={pub.links.doi} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>
                            DOI
                          </a>
                        )}
                        {pub.links.arxiv && (
                          <a href={pub.links.arxiv} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 'var(--text-xs)' }}>
                            arXiv
                          </a>
                        )}
                        {pub.bibtex && (
                          <button
                            className={`btn btn-ghost ${styles.bibtexBtn}`}
                            onClick={() => copyBibtex(pub)}
                            aria-label={`Copy BibTeX for ${pub.title}`}
                            style={{ fontSize: 'var(--text-xs)' }}
                          >
                            <CopyIcon />
                            {copiedId === pub.id ? 'Copied!' : 'BibTeX'}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon} aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
function PDFIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
}
function CopyIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
}
