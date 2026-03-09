import { useState, useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Project } from '@/types'
import styles from './NoteSummaryDemo.module.css'

interface NoteSummaryDemoProps {
  project: Project
}

// Highlight types map to CSS classes
type HighlightKey = 'hf' | 'volume' | 'ckd' | 'htn' | 'med' | 'assess' | 'plan'

const HIGHLIGHT_COLORS: Record<HighlightKey, string> = {
  hf:     styles.hlHf,
  volume: styles.hlVolume,
  ckd:    styles.hlCkd,
  htn:    styles.hlHtn,
  med:    styles.hlMed,
  assess: styles.hlAssess,
  plan:   styles.hlPlan,
}

type TabKey = 'current' | 'future'

export default function NoteSummaryDemo({ project }: NoteSummaryDemoProps) {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(false)
  const [tab, setTab] = useState<TabKey>('current')
  const [hoveredHighlight, setHoveredHighlight] = useState<HighlightKey | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleActivate = useCallback(() => setActive(true), [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!active && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setActive(true)
    }
  }, [active])

  const handleTabChange = (t: TabKey) => {
    setTab(t)
    setHoveredHighlight(null)
  }

  // Select note/summary based on active tab
  const noteText = tab === 'future' ? (project.futureNote ?? '') : (project.demoNote ?? '')
  const summary = tab === 'future' ? project.futureSummary : project.demoSummary
  const hasFuture = !!project.futureNote

  const buildHighlightedNote = () => {
    if (!hoveredHighlight || !summary) return [noteText]
    // Collect all spans for this highlight key
    const allItems = [
      ...(summary.problems ?? []),
      ...(summary.medications ?? []),
      ...(summary.assessment ?? []),
      ...(summary.plan ?? []),
    ].filter(item => item.highlight === hoveredHighlight)

    const spans = allItems.flatMap(item => item.spans ?? []).filter(Boolean)
    if (!spans.length) return [noteText]

    // Split note text into highlighted/normal segments
    let remaining = noteText
    const parts: { text: string; highlighted: boolean }[] = []

    // Build a list of [start, end] positions for each span occurrence
    const ranges: { start: number; end: number }[] = []
    for (const span of spans) {
      const lower = remaining.toLowerCase()
      let idx = lower.indexOf(span.toLowerCase())
      while (idx !== -1) {
        ranges.push({ start: idx, end: idx + span.length })
        idx = lower.indexOf(span.toLowerCase(), idx + 1)
      }
    }
    ranges.sort((a, b) => a.start - b.start)

    // Merge overlapping ranges
    const merged: { start: number; end: number }[] = []
    for (const r of ranges) {
      if (!merged.length || r.start > merged[merged.length - 1].end) {
        merged.push({ ...r })
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, r.end)
      }
    }

    let cursor = 0
    for (const { start, end } of merged) {
      if (cursor < start) parts.push({ text: remaining.slice(cursor, start), highlighted: false })
      parts.push({ text: remaining.slice(start, end), highlighted: true })
      cursor = end
    }
    if (cursor < remaining.length) parts.push({ text: remaining.slice(cursor), highlighted: false })

    return parts
  }

  const noteParts = buildHighlightedNote()

  if (!active) {
    return (
      <div
        className={styles.preview}
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        aria-label="Click to preview clinical note summarization demo"
      >
        <div className={styles.previewInner}>
          <div className={styles.previewIcon} aria-hidden="true">
            <NotePreviewSVG />
          </div>
          <p className={styles.previewHint}>
            <span className={styles.previewHintIcon} aria-hidden="true">↕</span>
            Hover to preview · Tap to activate
          </p>
          <span className="tag">Synthetic example</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`${styles.demo} ${reducedMotion ? '' : styles.demoAnimated}`}>
        <div className={styles.demoHeader}>
          <span className="label">Dose Extraction Demo</span>
          {hasFuture && (
            <div className={styles.tabGroup} role="tablist" aria-label="Demo mode">
              <button
                role="tab"
                aria-selected={tab === 'current'}
                className={`${styles.tabBtn} ${tab === 'current' ? styles.tabBtnActive : ''}`}
                onClick={() => handleTabChange('current')}
              >
                Sig Parsing
              </button>
              <button
                role="tab"
                aria-selected={tab === 'future'}
                className={`${styles.tabBtn} ${tab === 'future' ? styles.tabBtnActive : ''} ${styles.tabBtnFuture}`}
                onClick={() => handleTabChange('future')}
              >
                Clinical Notes
                <span className={styles.futurePill}>Future</span>
              </button>
            </div>
          )}
          <span className={`tag ${styles.syntheticTag}`}>Synthetic example</span>
          <button
            className={`btn btn-outline ${styles.expandBtn}`}
            onClick={() => setModalOpen(true)}
            aria-label="Expand demo to full view"
          >
            Expand
          </button>
        </div>

        <div className={styles.splitView}>
          {/* Left: Clinical note */}
          <div className={styles.notePanel} aria-label="Clinical note">
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>{tab === 'future' ? 'Progress Note (Narrative)' : 'Prescription Sig'}</span>
              <span className={styles.panelMeta}>Hover summary bullets to highlight spans</span>
            </div>
            <div className={styles.noteScroll}>
              <p className={styles.noteText}>
                {Array.isArray(noteParts)
                  ? noteParts.map((part, i) =>
                      typeof part === 'string' ? (
                        part
                      ) : (
                        <mark
                          key={i}
                          className={`${styles.highlight} ${part.highlighted ? (hoveredHighlight ? HIGHLIGHT_COLORS[hoveredHighlight] : '') : ''}`}
                        >
                          {part.text}
                        </mark>
                      )
                    )
                  : noteText}
              </p>
            </div>
          </div>

          {/* Right: Summary */}
          <div className={styles.summaryPanel} aria-label="Structured summary">
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>Structured Summary</span>
            </div>
            {summary && (
              <div className={styles.summaryScroll}>
                <SummarySection
                  title="Problems"
                  items={summary.problems}
                  setHover={setHoveredHighlight}
                />
                <SummarySection
                  title="Medications"
                  items={summary.medications}
                  setHover={setHoveredHighlight}
                />
                <SummarySection
                  title="Assessment"
                  items={summary.assessment}
                  setHover={setHoveredHighlight}
                />
                <SummarySection
                  title="Plan"
                  items={summary.plan}
                  setHover={setHoveredHighlight}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Full clinical note and summary"
        >
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>Clinical Note Summarization — Full View</h3>
              <span className={`tag ${styles.syntheticTag}`}>Synthetic example</span>
              <button
                className={`btn btn-ghost ${styles.closeBtn}`}
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.splitView} style={{ height: '100%' }}>
                <div className={styles.notePanel}>
                  <div className={styles.panelHeader}>
                    <span className={styles.panelLabel}>Progress Note</span>
                  </div>
                  <div className={styles.noteScroll} style={{ maxHeight: 'none', height: '100%' }}>
                    <p className={styles.noteText}>{noteText}</p>
                  </div>
                </div>
                <div className={styles.summaryPanel}>
                  <div className={styles.panelHeader}>
                    <span className={styles.panelLabel}>Structured Summary</span>
                  </div>
                  {summary && (
                    <div className={styles.summaryScroll} style={{ maxHeight: 'none', height: '100%' }}>
                      <SummarySection title="Problems" items={summary.problems} setHover={() => {}} />
                      <SummarySection title="Medications" items={summary.medications} setHover={() => {}} />
                      <SummarySection title="Assessment" items={summary.assessment} setHover={() => {}} />
                      <SummarySection title="Plan" items={summary.plan} setHover={() => {}} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface SummarySectionProps {
  title: string
  items: Array<{ text: string; highlight: string; spans?: string[] }>
  setHover: (key: HighlightKey | null) => void
}

function SummarySection({ title, items, setHover }: SummarySectionProps) {
  return (
    <div className={styles.summarySection}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <ul className={styles.bulletList}>
        {items.map((item, i) => (
          <li
            key={i}
            className={`${styles.bullet} ${item.spans?.length ? styles.bulletHoverable : ''}`}
            onMouseEnter={() => item.spans?.length ? setHover(item.highlight as HighlightKey) : undefined}
            onMouseLeave={() => setHover(null)}
            onFocus={() => item.spans?.length ? setHover(item.highlight as HighlightKey) : undefined}
            onBlur={() => setHover(null)}
            tabIndex={item.spans?.length ? 0 : undefined}
            aria-label={item.spans?.length ? `${item.text} (hover to highlight source spans)` : undefined}
          >
            <span className={styles.bulletDot} aria-hidden="true" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotePreviewSVG() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="34" height="56" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <rect x="44" y="2" width="34" height="56" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      {[10, 16, 22, 28, 34, 40].map((y, i) => (
        <line key={i} x1="7" y1={y} x2={26 + (i%3 === 2 ? -6 : 0)} y2={y} stroke="currentColor" strokeWidth="1.2" opacity="0.2"/>
      ))}
      <rect x="49" y="10" width="24" height="4" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="49" y="20" width="20" height="3" rx="1" fill="currentColor" opacity="0.12"/>
      <rect x="49" y="30" width="22" height="3" rx="1" fill="currentColor" opacity="0.12"/>
      <rect x="49" y="40" width="18" height="3" rx="1" fill="currentColor" opacity="0.12"/>
      <path d="M38 30 L42 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M40 28 L42 30 L40 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  )
}
