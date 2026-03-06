import { useState, useId } from 'react'
import styles from './TradeoffExplorerDemo.module.css'

// Synthetic PR curves for a sepsis prediction model
function getPrecisionRecall(threshold: number) {
  // Simulate a realistic PR curve shape
  const t = threshold / 100
  const precision = 0.35 + 0.55 * Math.pow(t, 0.6)
  const recall    = 1 - Math.pow(t, 0.4) * 0.85
  const f1 = 2 * (precision * recall) / (precision + recall)
  const ppt = Math.round(10000 * (1 - t) * 0.72) // patients flagged per 10k
  return {
    precision: Math.min(Math.max(precision, 0.35), 0.97),
    recall:    Math.min(Math.max(recall, 0.08), 0.96),
    f1:        Math.round(f1 * 100),
    ppt,
  }
}

function getClinicalImpact(threshold: number, precision: number, recall: number) {
  if (threshold < 20) {
    return `At this low threshold the model flags most at-risk patients (recall ${Math.round(recall * 100)}%), but only ${Math.round(precision * 100)}% of alerts are true positives — clinicians may experience alert fatigue.`
  }
  if (threshold > 80) {
    return `At this high threshold precision is strong (${Math.round(precision * 100)}%), but the model misses ${Math.round((1 - recall) * 100)}% of true cases — high-risk patients may be overlooked.`
  }
  return `At this threshold, ${Math.round(precision * 100)}% of alerts are true positives and ${Math.round(recall * 100)}% of at-risk patients are caught. F1 = ${Math.round(2 * precision * recall / (precision + recall) * 100)}%. Consider whether false negatives or false positives carry higher clinical cost.`
}

export default function TradeoffExplorerDemo() {
  const [threshold, setThreshold] = useState(40)
  const sliderId = useId()

  const { precision, recall, f1, ppt } = getPrecisionRecall(threshold)
  const impact = getClinicalImpact(threshold, precision, recall)

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Tradeoff Explorer</span>
        <span className="tag">Synthetic model</span>
      </div>

      <div className={styles.body}>
        {/* Slider */}
        <div className={styles.sliderSection}>
          <label htmlFor={sliderId} className={styles.sliderLabel}>
            Classification Threshold: <strong>{threshold}%</strong>
          </label>
          <input
            id={sliderId}
            type="range"
            min={5}
            max={95}
            step={1}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className={styles.slider}
            aria-valuetext={`Threshold: ${threshold}%, Precision: ${Math.round(precision * 100)}%, Recall: ${Math.round(recall * 100)}%`}
          />
          <div className={styles.sliderRange}>
            <span>Low threshold</span>
            <span>High threshold</span>
          </div>
        </div>

        {/* Bars */}
        <div className={styles.barsSection} aria-label="Precision and recall bars">
          <MetricBar label="Precision" value={precision} color="var(--color-blue-500)" />
          <MetricBar label="Recall"    value={recall}    color="var(--color-blue-300)" />
          <div className={styles.f1Row}>
            <span className={styles.f1Label}>F1</span>
            <span className={styles.f1Value}>{f1}</span>
          </div>
          <div className={styles.pptRow}>
            <span className={styles.pptLabel}>Patients flagged per 10k</span>
            <span className={styles.pptValue}>~{ppt.toLocaleString()}</span>
          </div>
        </div>

        {/* Impact sentence */}
        <div className={styles.impactSection} aria-live="polite">
          <span className="label">Clinical Impact</span>
          <p className={styles.impactText}>{impact}</p>
        </div>

        {/* Mini PR curve SVG */}
        <div className={styles.curveSection} aria-hidden="true">
          <PRCurveSVG currentThreshold={threshold} />
        </div>
      </div>
    </div>
  )
}

interface MetricBarProps {
  label: string
  value: number
  color: string
}

function MetricBar({ label, value, color }: MetricBarProps) {
  const pct = Math.round(value * 100)
  return (
    <div className={styles.metricBar}>
      <div className={styles.metricLabelRow}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue}>{pct}%</span>
      </div>
      <div className={styles.barTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${pct}%`}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function PRCurveSVG({ currentThreshold }: { currentThreshold: number }) {
  const points: [number, number][] = []
  for (let t = 5; t <= 95; t += 5) {
    const { precision, recall } = getPrecisionRecall(t)
    const svgX = 20 + recall * 160
    const svgY = 160 - precision * 140
    points.push([svgX, svgY])
  }

  const { precision, recall } = getPrecisionRecall(currentThreshold)
  const cx = 20 + recall * 160
  const cy = 160 - precision * 140

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ')

  return (
    <svg viewBox="0 0 200 180" className={styles.curveSvg}>
      {/* Axes */}
      <line x1="20" y1="20" x2="20" y2="165" stroke="var(--border-medium)" strokeWidth="0.75"/>
      <line x1="20" y1="165" x2="190" y2="165" stroke="var(--border-medium)" strokeWidth="0.75"/>

      {/* Axis labels */}
      <text x="105" y="178" textAnchor="middle" fontSize="8" fill="var(--text-tertiary)" fontFamily="var(--font-body)">Recall</text>
      <text x="10" y="95" textAnchor="middle" fontSize="8" fill="var(--text-tertiary)" fontFamily="var(--font-body)" transform="rotate(-90 10 95)">Precision</text>

      {/* PR curve */}
      <path d={pathD} stroke="var(--accent-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>

      {/* Current operating point */}
      <circle cx={cx} cy={cy} r="5" fill="var(--accent-primary)" />
      <circle cx={cx} cy={cy} r="9" fill="var(--accent-primary)" opacity="0.2" />

      {/* Gridlines */}
      {[0.25, 0.5, 0.75, 1].map(v => (
        <line key={v}
          x1="20" y1={160 - v * 140}
          x2="185" y2={160 - v * 140}
          stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3 3"
        />
      ))}
    </svg>
  )
}
