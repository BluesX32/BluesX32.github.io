import { useState, useMemo } from 'react'
import type { Project } from '@/types'
import styles from './CohortBuilderDemo.module.css'

interface CohortBuilderDemoProps {
  project: Project
}

interface Criterion {
  code?: string
  name?: string
  label: string
  active: boolean
}

const BASE_N = 8420
const SEED_MAP: Record<string, number> = {
  'M33.0x': 1850, 'M32.x': 3200, 'M34.x': 980, 'H20.x': 2100,
  'Hospitalized Infection': 2800, 'PJP': 420, 'PML': 180, 'VZV/Shingles': 1900,
  'MMF': 2600, 'RTX': 1400, 'IVIG': 680, 'JAKi': 950,
}

function calcCohort(criteria: { icd: Criterion[]; labs: Criterion[]; meds: Criterion[] }) {
  const all = [...criteria.icd, ...criteria.labs, ...criteria.meds]
  const active = all.filter(c => c.active)
  if (!active.length) return { n: 0, pct: 0 }

  // Simulate intersection (decreasing returns)
  let n = BASE_N
  for (let i = 0; i < active.length; i++) {
    const key = active[i].code ?? active[i].name ?? ''
    const contribution = SEED_MAP[key] ?? 1200
    const weight = i === 0 ? 1 : 0.45 + 0.1 * i
    n = Math.min(n, Math.round(contribution * weight))
  }
  return { n, pct: Math.round((n / BASE_N) * 100) }
}

const DEMO_SPLIT = [
  { label: 'Male', pct: 54, color: 'var(--color-blue-500)' },
  { label: 'Female', pct: 44, color: 'var(--color-blue-300)' },
  { label: 'Other', pct: 2, color: 'var(--color-gray-300)' },
]

export default function CohortBuilderDemo({ project }: CohortBuilderDemoProps) {
  const initialCriteria = project.cohortCriteria ?? { icd: [], labs: [], meds: [] }

  const [icd, setIcd] = useState<Criterion[]>(initialCriteria.icd ?? [])
  const [labs, setLabs] = useState<Criterion[]>(initialCriteria.labs ?? [])
  const [meds, setMeds] = useState<Criterion[]>(initialCriteria.meds ?? [])

  const { n, pct } = useMemo(() => calcCohort({ icd, labs, meds }), [icd, labs, meds])

  const toggle = (
    _list: Criterion[],
    setList: React.Dispatch<React.SetStateAction<Criterion[]>>,
    idx: number
  ) => {
    setList(prev => prev.map((c, i) => i === idx ? { ...c, active: !c.active } : c))
  }

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Cohort Builder Preview</span>
        <span className={`tag`}>Synthetic numbers</span>
      </div>

      <div className={styles.body}>
        {/* Criteria panel */}
        <div className={styles.criteriaPanel}>
          <CriteriaGroup
            title="Disease Indications"
            items={icd}
            onToggle={(i) => toggle(icd, setIcd, i)}
          />
          <CriteriaGroup
            title="Outcomes"
            items={labs}
            onToggle={(i) => toggle(labs, setLabs, i)}
          />
          <CriteriaGroup
            title="Drug Comparators"
            items={meds}
            onToggle={(i) => toggle(meds, setMeds, i)}
          />
        </div>

        {/* Result panel */}
        <div className={styles.resultPanel} aria-live="polite">
          <div className={styles.cohortSize}>
            <span className={styles.cohortN}>{n.toLocaleString()}</span>
            <span className={styles.cohortLabel}>patients</span>
          </div>

          {/* Bar */}
          <div className={styles.barWrap} role="img" aria-label={`Cohort size: ${pct}% of base population`}>
            <div
              className={styles.bar}
              style={{ width: `${pct}%` }}
            />
            <span className={styles.barPct}>{pct}%</span>
          </div>

          <p className={styles.baseNote}>of {BASE_N.toLocaleString()} base patients</p>

          {/* Demographic split */}
          {n > 0 && (
            <div className={styles.demSplit} aria-label="Estimated demographic split">
              <span className="label" style={{ fontSize: 'var(--text-xs)' }}>Est. sex split</span>
              <div className={styles.demBar}>
                {DEMO_SPLIT.map(d => (
                  <div
                    key={d.label}
                    className={styles.demSegment}
                    style={{ width: `${d.pct}%`, background: d.color }}
                    title={`${d.label}: ~${d.pct}%`}
                  />
                ))}
              </div>
              <div className={styles.demLegend}>
                {DEMO_SPLIT.map(d => (
                  <span key={d.label} className={styles.demLegendItem}>
                    <span className={styles.demDot} style={{ background: d.color }} />
                    {d.label} ~{d.pct}%
                  </span>
                ))}
              </div>
              <p className={styles.syntheticNote}>*Synthetic estimates only</p>
            </div>
          )}

          {n === 0 && (
            <p className={styles.emptyNote}>Select criteria to build a cohort.</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface CriteriaGroupProps {
  title: string
  items: Criterion[]
  onToggle: (i: number) => void
}

function CriteriaGroup({ title, items, onToggle }: CriteriaGroupProps) {
  return (
    <div className={styles.group}>
      <span className={`label ${styles.groupTitle}`}>{title}</span>
      <div className={styles.chips}>
        {items.map((c, i) => (
          <button
            key={i}
            className={`${styles.chip} ${c.active ? styles.chipActive : ''}`}
            onClick={() => onToggle(i)}
            aria-pressed={c.active}
            aria-label={`${c.label}: ${c.active ? 'enabled' : 'disabled'}`}
          >
            {c.code && <span className={styles.chipCode}>{c.code}</span>}
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
