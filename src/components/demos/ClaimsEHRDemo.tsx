import { useState } from 'react'
import styles from './ClaimsEHRDemo.module.css'

const YEARS = [
  { year: 2010, hcos: 35, patients: 560251,  claimsOnly: 51, both: 46, ehrOnly: 3 },
  { year: 2011, hcos: 40, patients: 833156,  claimsOnly: 47, both: 50, ehrOnly: 2 },
  { year: 2012, hcos: 43, patients: 1173905, claimsOnly: 46, both: 52, ehrOnly: 3 },
  { year: 2013, hcos: 46, patients: 1416581, claimsOnly: 44, both: 53, ehrOnly: 3 },
  { year: 2014, hcos: 47, patients: 1486335, claimsOnly: 41, both: 55, ehrOnly: 4 },
  { year: 2015, hcos: 52, patients: 1699782, claimsOnly: 42, both: 55, ehrOnly: 4 },
  { year: 2016, hcos: 54, patients: 1887956, claimsOnly: 42, both: 55, ehrOnly: 3 },
  { year: 2017, hcos: 53, patients: 1891945, claimsOnly: 41, both: 56, ehrOnly: 3 },
  { year: 2018, hcos: 49, patients: 1755627, claimsOnly: 42, both: 55, ehrOnly: 3 },
  { year: 2019, hcos: 44, patients: 1697991, claimsOnly: 41, both: 56, ehrOnly: 3 },
  { year: 2020, hcos: 38, patients: 1209616, claimsOnly: 41, both: 56, ehrOnly: 3 },
  { year: 2021, hcos: 29, patients: 1032416, claimsOnly: 46, both: 50, ehrOnly: 3 },
  { year: 2022, hcos: 20, patients: 346195,  claimsOnly: 61, both: 38, ehrOnly: 2 },
]

function fmtN(n: number) {
  return n >= 1000000
    ? (n / 1000000).toFixed(1) + 'M'
    : n >= 1000
    ? (n / 1000).toFixed(0) + 'K'
    : String(n)
}

export default function ClaimsEHRDemo() {
  const [selectedYear, setSelectedYear] = useState<number>(2017)
  const sel = YEARS.find(d => d.year === selectedYear)!

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Interactive</span>
        <span className={styles.headerTitle}>Diagnosis Capture: Claims vs. EHR, 2010–2022</span>
        <span className={styles.headerNote}>Click any year to inspect</span>
      </div>

      <div className={styles.body}>
        {/* Chart panel */}
        <div className={styles.chartPanel}>
          <div className={styles.legend}>
            <span className={`${styles.dot} ${styles.dotClaims}`} />
            <span className={styles.legendLabel}>Claims only</span>
            <span className={`${styles.dot} ${styles.dotBoth}`} />
            <span className={styles.legendLabel}>Both</span>
            <span className={`${styles.dot} ${styles.dotEhr}`} />
            <span className={styles.legendLabel}>EHR only</span>
          </div>
          <div className={styles.bars}>
            {YEARS.map(d => (
              <button
                key={d.year}
                className={`${styles.barRow} ${d.year === selectedYear ? styles.barRowActive : ''}`}
                onClick={() => setSelectedYear(d.year)}
                title={`${d.year}: ${d.claimsOnly}% claims-only, ${d.both}% both, ${d.ehrOnly}% EHR-only`}
              >
                <span className={styles.yearLabel}>{d.year}</span>
                <span className={styles.stackWrap}>
                  <span
                    className={`${styles.seg} ${styles.segClaims}`}
                    style={{ width: `${d.claimsOnly}%` }}
                  />
                  <span
                    className={`${styles.seg} ${styles.segBoth}`}
                    style={{ width: `${d.both}%` }}
                  />
                  <span
                    className={`${styles.seg} ${styles.segEhr}`}
                    style={{ width: `${d.ehrOnly}%` }}
                  />
                </span>
                <span className={styles.pctLabel}>{d.claimsOnly}%</span>
              </button>
            ))}
          </div>
          <p className={styles.chartNote}>Bar width = % of patient-diagnoses. Left number = claims-only %.</p>
        </div>

        {/* Detail panel */}
        <div className={styles.detailPanel}>
          <div className={styles.yearBadge}>{sel.year}</div>

          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{fmtN(sel.patients)}</span>
              <span className={styles.statLabel}>patients</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{sel.hcos}</span>
              <span className={styles.statLabel}>health orgs</span>
            </div>
          </div>

          <div className={styles.breakdown}>
            <div className={styles.bkRow}>
              <span className={`${styles.bkDot} ${styles.dotClaims}`} />
              <span className={styles.bkLabel}>Claims only</span>
              <span className={styles.bkVal}>{sel.claimsOnly}%</span>
            </div>
            <div className={styles.bkRow}>
              <span className={`${styles.bkDot} ${styles.dotBoth}`} />
              <span className={styles.bkLabel}>Both sources</span>
              <span className={styles.bkVal}>{sel.both}%</span>
            </div>
            <div className={styles.bkRow}>
              <span className={`${styles.bkDot} ${styles.dotEhr}`} />
              <span className={styles.bkLabel}>EHR only</span>
              <span className={styles.bkVal}>{sel.ehrOnly}%</span>
            </div>
          </div>

          <div className={styles.insight}>
            {sel.year <= 2019 ? (
              <p>
                EHR completeness <strong>improving</strong> pre-2020.{' '}
                {100 - sel.claimsOnly}% of diagnoses captured in EHR.
              </p>
            ) : sel.year === 2020 ? (
              <p>
                COVID-19 disruption begins.
                Claims-only rate stable, but HCO count drops from 44 to 38.
              </p>
            ) : (
              <p>
                Post-COVID reversal: claims-only share{' '}
                <strong>rises to {sel.claimsOnly}%</strong>, HCO count falls to {sel.hcos}.
              </p>
            )}
          </div>

          <p className={styles.sourceNote}>
            Source: Xiong et al., OLDW (Optum Labs), N&nbsp;=&nbsp;16.9M patient-years
          </p>
        </div>
      </div>
    </div>
  )
}
