import { useState, useMemo, useCallback } from 'react'
import questionsData from '@/content/questions.json'
import styles from './Questions.module.css'

const ALL_TAGS = Array.from(
  new Set(questionsData.flatMap(q => q.tags))
).sort()

export default function Questions() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [shuffleSeed, setShuffleSeed] = useState(0)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const base = questionsData.filter(item => {
      const matchSearch = !q || item.question.toLowerCase().includes(q) || item.note.toLowerCase().includes(q)
      const matchTag = !activeTag || item.tags.includes(activeTag)
      return matchSearch && matchTag
    })

    if (shuffleSeed > 0) {
      const shuffled = [...base]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    return base
  }, [search, activeTag, shuffleSeed])

  const toggleExpanded = useCallback((id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const shuffle = useCallback(() => {
    setShuffleSeed(s => s + 1)
    setExpanded({})
  }, [])

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Notebook</span>
          <h1 className="section-title">Questions</h1>
          <p className="section-subtitle">
            A commonplace book of open questions — things I keep returning to when thinking about
            disease, measurement, clinical decision-making, and what it means for research to be honest.
            These aren't rhetorical. They're genuinely unresolved.
          </p>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <SearchIcon />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search questions"
            />
          </div>

          <div className={styles.tags} role="group" aria-label="Filter by tag">
            <button
              className={`${styles.tagBtn} ${!activeTag ? styles.tagBtnActive : ''}`}
              onClick={() => setActiveTag(null)}
              aria-pressed={!activeTag}
            >
              All
            </button>
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${activeTag === tag ? styles.tagBtnActive : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            className={`btn btn-ghost ${styles.shuffleBtn}`}
            onClick={shuffle}
            aria-label="Shuffle questions"
            title="Show questions in random order"
          >
            <ShuffleIcon />
            Shuffle
          </button>
        </div>

        {/* Count */}
        <p className={styles.count} aria-live="polite">
          {filtered.length === questionsData.length
            ? `${questionsData.length} questions`
            : `${filtered.length} of ${questionsData.length} questions`}
        </p>

        {/* Questions */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No questions match your search.</p>
            <button className="btn btn-ghost" onClick={() => { setSearch(''); setActiveTag(null) }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles.questionGrid}>
            {filtered.map(q => (
              <article key={q.id} className={styles.questionCard} aria-labelledby={`q-${q.id}`}>
                <button
                  className={styles.questionBtn}
                  onClick={() => toggleExpanded(q.id)}
                  aria-expanded={expanded[q.id] ?? false}
                  aria-controls={`note-${q.id}`}
                >
                  <h2 id={`q-${q.id}`} className={styles.questionText}>
                    {q.question}
                  </h2>
                  <span
                    className={styles.expandIcon}
                    style={{ transform: expanded[q.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>

                <div className={styles.questionMeta}>
                  {q.tags.map(t => (
                    <button
                      key={t}
                      className={`tag ${styles.qTag} ${activeTag === t ? styles.qTagActive : ''}`}
                      onClick={() => setActiveTag(activeTag === t ? null : t)}
                      aria-label={`Filter by ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {expanded[q.id] && (
                  <div id={`note-${q.id}`} className={styles.noteText}>
                    <p>{q.note}</p>
                  </div>
                )}
              </article>
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
function ShuffleIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
}
