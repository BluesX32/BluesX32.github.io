import { useState } from 'react'
import styles from './TradeoffExplorerDemo.module.css'

type Category = 'race' | 'payer' | 'route' | 'clinical'

interface ORRow {
  label: string
  ref?: boolean
  or: number
  lo: number
  hi: number
  sig: boolean
  note?: string
}

const DATA: Record<Category, { rows: ORRow[]; caption: string }> = {
  race: {
    caption: 'Adjusted ORs for 30-day ED visit by race/ethnicity (ref: White)',
    rows: [
      { label: 'White', ref: true, or: 1, lo: 1, hi: 1, sig: false },
      {
        label: 'Black', or: 1.16, lo: 1.12, hi: 1.20, sig: true,
        note: 'Black patients had 16% higher odds of 30-day ED visits after adjusting for clinical and socioeconomic factors (OR 1.16, 95% CI 1.12–1.20, p<0.001). In the race × state interaction model, this was 19% higher in Florida, but attenuated to ~7% combined effect in Maryland.',
      },
      {
        label: 'Hispanic', or: 1.04, lo: 1.00, hi: 1.08, sig: false,
        note: 'Hispanic patients showed a modest increase that did not reach significance in the main model (OR 1.04, p=0.061). In the state interaction model, odds were 6% higher in Florida (OR 1.06, p=0.009) but the interaction term for Maryland reduced combined odds to ~0.90 — suggesting state-level policy moderates this disparity.',
      },
      {
        label: 'Asian / PI', or: 0.86, lo: 0.76, hi: 0.98, sig: true,
        note: 'Asian or Pacific Islander patients had significantly lower odds (OR 0.86, 95% CI 0.76–0.98, p=0.020). The aggregated category masks within-group heterogeneity — this finding should be interpreted cautiously.',
      },
      {
        label: 'Other', or: 0.95, lo: 0.86, hi: 1.05, sig: false,
        note: 'No statistically significant difference from White patients in the fully adjusted model (OR 0.95, p=0.337).',
      },
    ],
  },
  payer: {
    caption: 'Adjusted ORs by primary payer (ref: Private insurance)',
    rows: [
      { label: 'Private (ref)', ref: true, or: 1, lo: 1, hi: 1, sig: false },
      {
        label: 'Medicare', or: 1.70, lo: 1.61, hi: 1.79, sig: true,
        note: 'Medicare beneficiaries had 70% higher odds of a 30-day ED visit (OR 1.70, 95% CI 1.61–1.79). Older patients with higher comorbidity burden and more complex procedures likely drive this elevated risk.',
      },
      {
        label: 'Medicaid', or: 2.09, lo: 2.00, hi: 2.18, sig: true,
        note: 'The strongest insurance effect — Medicaid patients had more than twice the odds (OR 2.09, 95% CI 2.00–2.18). Limited access to timely outpatient follow-up care is a likely driver, shifting minor post-operative concerns to the ED.',
      },
      {
        label: 'Self-pay', or: 1.32, lo: 1.17, hi: 1.49, sig: true,
        note: 'Self-pay patients had 32% higher odds (OR 1.32, 95% CI 1.17–1.49), consistent with barriers to scheduled post-operative follow-up.',
      },
      {
        label: 'Other payer', or: 1.29, lo: 1.21, hi: 1.39, sig: true,
        note: 'Other payer types also had significantly elevated odds (OR 1.29, 95% CI 1.21–1.39, p<0.001).',
      },
    ],
  },
  route: {
    caption: 'Adjusted ORs by hysterectomy route (ref: Abdominal)',
    rows: [
      { label: 'Abdominal (ref)', ref: true, or: 1, lo: 1, hi: 1, sig: false },
      {
        label: 'Vaginal', or: 1.21, lo: 1.12, hi: 1.30, sig: true,
        note: 'Minimally invasive approaches paradoxically showed higher ED odds than abdominal hysterectomy. Same-day discharge after MIS likely shifts minor post-op concerns (pain, urinary symptoms) to the ED rather than the inpatient stay. However, major complication rates were lower for MIS.',
      },
      {
        label: 'Laparoscopic', or: 1.18, lo: 1.11, hi: 1.25, sig: true,
        note: 'Higher odds overall (OR 1.18), but outpatient laparoscopic hysterectomy was actually protective in the route × setting interaction model (aOR 0.77, 95% CI 0.65–0.92), supporting the discharge-pathway explanation.',
      },
      {
        label: 'Robotic-assisted', or: 1.22, lo: 1.16, hi: 1.30, sig: true,
        note: 'Robotic-assisted hysterectomy showed a similar pattern (OR 1.22 overall), but outpatient robotic was protective (aOR 0.82, 95% CI 0.69–0.97). Black patients had persistently higher abdominal hysterectomy rates (25–37%) compared to White patients (<25%).',
      },
    ],
  },
  clinical: {
    caption: 'Selected clinical and socioeconomic predictors of 30-day ED visits',
    rows: [
      {
        label: 'Outpatient (vs inpatient)', or: 0.74, lo: 0.70, hi: 0.78, sig: true,
        note: 'Outpatient surgery was associated with 26% lower odds of 30-day ED return (OR 0.74, 95% CI 0.70–0.78), reflecting healthier case-mix in outpatient settings rather than necessarily better post-op care.',
      },
      {
        label: 'Maryland (vs Florida)', or: 0.94, lo: 0.90, hi: 0.98, sig: true,
        note: 'Maryland residents had slightly but significantly lower odds than Florida (OR 0.94, p=0.006). Maryland\'s all-payer Total Cost of Care (TCOC) model may facilitate timely outpatient follow-up. Hysterectomy charges were also substantially lower in Maryland.',
      },
      {
        label: 'Cancer indication', or: 1.13, lo: 1.07, hi: 1.19, sig: true,
        note: 'Cancer indications were associated with 13% higher odds (OR 1.13, 95% CI 1.07–1.19), consistent with greater surgical complexity and higher baseline health risk in oncologic cases.',
      },
      {
        label: 'Income Q4 (vs Q1)', or: 0.85, lo: 0.80, hi: 0.89, sig: true,
        note: 'Patients in the highest income quartile had 15% lower odds of ED visits than those in the lowest (OR 0.85, 95% CI 0.80–0.89). A clear socioeconomic gradient persisted across all quartiles, pointing to reduced access to follow-up care and health literacy as mediators.',
      },
      {
        label: 'CCI (per unit)', or: 1.16, lo: 1.15, hi: 1.18, sig: true,
        note: 'Each 1-unit increase in the Charlson Comorbidity Index was associated with 16% higher odds (OR 1.16, 95% CI 1.15–1.18), confirming that baseline health burden is a strong predictor of post-surgical ED utilization.',
      },
    ],
  },
}

const CATEGORY_LABELS: Record<Category, string> = {
  race: 'Race/Ethnicity',
  payer: 'Insurance',
  route: 'Surgery Route',
  clinical: 'Other Factors',
}

const OR_MIN = 0.4
const OR_MAX = 2.4
const PLOT_LEFT = 150
const PLOT_RIGHT = 322
const ROW_H = 30
const HEADER_H = 26

function orToX(or: number) {
  return PLOT_LEFT + (Math.min(Math.max(or, OR_MIN), OR_MAX) - OR_MIN) / (OR_MAX - OR_MIN) * (PLOT_RIGHT - PLOT_LEFT)
}

export default function TradeoffExplorerDemo() {
  const [category, setCategory] = useState<Category>('race')
  const [selected, setSelected] = useState<number | null>(null)

  const { rows, caption } = DATA[category]
  const selectedRow = selected !== null ? rows[selected] : null
  const svgH = HEADER_H + rows.length * ROW_H + 18
  const refX = orToX(1.0)

  const handleCategoryChange = (c: Category) => {
    setCategory(c)
    setSelected(null)
  }

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Disparities Explorer · Published Results</span>
        <span className="tag">Adjusted ORs from Table 2</span>
      </div>

      <div className={styles.body}>
        {/* Category tabs */}
        <div className={styles.catTabs} role="tablist" aria-label="Predictor category">
          {(Object.keys(DATA) as Category[]).map(c => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`${styles.catTab} ${category === c ? styles.catTabActive : ''}`}
              onClick={() => handleCategoryChange(c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Forest plot */}
        <div className={styles.forestWrap}>
          <svg
            viewBox={`0 0 360 ${svgH}`}
            className={styles.forestSvg}
            role="img"
            aria-label={caption}
          >
            {/* Gridlines + axis tick labels */}
            {[0.5, 1.0, 1.5, 2.0].map(v => (
              <g key={v}>
                <line
                  x1={orToX(v)} y1={HEADER_H - 6}
                  x2={orToX(v)} y2={svgH - 14}
                  stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3"
                />
                <text
                  x={orToX(v)} y={svgH - 3}
                  textAnchor="middle" fontSize="8" fill="var(--text-tertiary)"
                  fontFamily="var(--font-body)"
                >{v.toFixed(1)}</text>
              </g>
            ))}

            {/* Reference line at 1.0 */}
            <line
              x1={refX} y1={HEADER_H - 6}
              x2={refX} y2={svgH - 14}
              stroke="var(--text-secondary)" strokeWidth="1" strokeDasharray="4 2" opacity="0.5"
            />

            {/* Column headers */}
            <text x={4} y={HEADER_H - 8} fontSize="8" fontWeight="600" fill="var(--text-tertiary)" fontFamily="var(--font-body)" textAnchor="start" letterSpacing="0.06em">GROUP</text>
            <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y={HEADER_H - 8} fontSize="8" fontWeight="600" fill="var(--text-tertiary)" fontFamily="var(--font-body)" textAnchor="middle" letterSpacing="0.06em">OR (95% CI)</text>
            <text x={354} y={HEADER_H - 8} fontSize="8" fontWeight="600" fill="var(--text-tertiary)" fontFamily="var(--font-body)" textAnchor="end" letterSpacing="0.06em">OR</text>

            {/* Rows */}
            {rows.map((row, i) => {
              const cy = HEADER_H + i * ROW_H + ROW_H / 2
              const cx = orToX(row.or)
              const lx = orToX(row.lo)
              const hx = orToX(row.hi)
              const isSelected = selected === i
              const color = row.ref || !row.sig
                ? 'var(--text-tertiary)'
                : row.or < 1
                  ? 'var(--color-blue-500)'
                  : 'var(--accent-primary)'

              return (
                <g
                  key={i}
                  style={{ cursor: row.note ? 'pointer' : 'default' }}
                  onClick={() => row.note ? setSelected(isSelected ? null : i) : undefined}
                  role={row.note ? 'button' : undefined}
                  tabIndex={row.note ? 0 : undefined}
                  aria-label={row.note ? `${row.label}: OR ${row.or}. Click for interpretation.` : undefined}
                  onKeyDown={e => { if (row.note && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setSelected(isSelected ? null : i) } }}
                >
                  {/* Row highlight */}
                  {isSelected && (
                    <rect x={0} y={cy - ROW_H / 2} width={360} height={ROW_H} fill="var(--accent-bg)" rx="2" />
                  )}

                  {/* Label */}
                  <text
                    x={4} y={cy + 4}
                    fontSize="9.5"
                    fill={isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                    fontFamily="var(--font-body)"
                    fontStyle={row.ref ? 'italic' : 'normal'}
                  >{row.label}</text>

                  {/* CI bar + estimate */}
                  {!row.ref ? (
                    <>
                      <line x1={lx} y1={cy} x2={hx} y2={cy} stroke={color} strokeWidth="2" opacity="0.7" />
                      <line x1={lx} y1={cy - 5} x2={lx} y2={cy + 5} stroke={color} strokeWidth="1.5" opacity="0.7" />
                      <line x1={hx} y1={cy - 5} x2={hx} y2={cy + 5} stroke={color} strokeWidth="1.5" opacity="0.7" />
                      <rect
                        x={cx - 5} y={cy - 5} width={10} height={10}
                        fill={color} rx="2"
                        opacity={row.sig ? 1 : 0.35}
                      />
                      <text
                        x={354} y={cy + 4}
                        fontSize="9" fontFamily="var(--font-body)" textAnchor="end"
                        fill={isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      >{row.or.toFixed(2)}</text>
                    </>
                  ) : (
                    <>
                      <line x1={refX - 4} y1={cy - 6} x2={refX + 4} y2={cy + 6} stroke="var(--text-tertiary)" strokeWidth="1.5" opacity="0.5" />
                      <line x1={refX - 4} y1={cy + 6} x2={refX + 4} y2={cy - 6} stroke="var(--text-tertiary)" strokeWidth="1.5" opacity="0.5" />
                      <text x={354} y={cy + 4} fontSize="9" fill="var(--text-tertiary)" fontFamily="var(--font-body)" textAnchor="end">ref</text>
                    </>
                  )}

                  {/* Click hint dot */}
                  {row.note && !isSelected && (
                    <circle cx={PLOT_LEFT - 8} cy={cy} r="2.5" fill="var(--accent-primary)" opacity="0.35" />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Interpretation panel */}
        <div className={styles.interpretation} aria-live="polite" aria-label="Row interpretation">
          {selectedRow?.note ? (
            <>
              <span className="label" style={{ fontSize: 'var(--text-xs)' }}>{selectedRow.label}</span>
              <p className={styles.interpretText}>{selectedRow.note}</p>
            </>
          ) : (
            <p className={styles.interpretHint}>
              <span className={styles.hintDot} aria-hidden="true" />
              Click any row to see interpretation
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
