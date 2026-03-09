import { useState } from 'react'
import styles from './AgentReproDemo.module.css'

interface Assertion {
  text: string
  original: string
  agent: string
  aligned: boolean
}

interface Study {
  id: string
  shortName: string
  topic: string
  assertions: Assertion[]
}

const STUDIES: Study[] = [
  {
    id: 'multivariate',
    shortName: 'Multivariate Regression',
    topic: 'Predicting MCI conversion using multivariate cognitive tests and Bayesian posttest probabilities',
    assertions: [
      { text: 'MBR of low scores (range)', original: '1.40–79.2%', agent: '10.9–51.3%', aligned: false },
      { text: 'Posttest probability at 2 years', original: '0.06–0.33', agent: '0.04', aligned: false },
      { text: 'Posttest prob. conversion to MCI', original: '0.12–0.32', agent: '0.67', aligned: false },
    ],
  },
  {
    id: 'network',
    shortName: 'Network Symptom Structures',
    topic: 'Network estimation of Alzheimer\'s disease symptom co-occurrence and community detection',
    assertions: [
      { text: 'Mean follow-up time (days)', original: '387', agent: '411', aligned: false },
      { text: 'Informant: lack of positive affect', original: 'True', agent: 'True', aligned: true },
      { text: 'Network structure p-value', original: '0.71', agent: '0.42', aligned: false },
      { text: 'Network connectivity p-value', original: '0.92', agent: '1.0', aligned: true },
      { text: 'Symptom clusters identified', original: '4', agent: '14', aligned: false },
    ],
  },
  {
    id: 'ethnoracial',
    shortName: 'Ethnoracial Differences',
    topic: 'Ethnoracial disparities in Alzheimer\'s Disease presentation across White, Black, and Hispanic patients',
    assertions: [
      { text: 'Median presentation age', original: '74–75', agent: '73–74.5', aligned: true },
      { text: 'Black/Hispanic more likely female', original: 'True', agent: 'True', aligned: true },
      { text: 'Black/Hispanic more likely single', original: 'True', agent: 'True', aligned: true },
      { text: 'Black/Hispanic less education', original: 'True', agent: 'True', aligned: true },
      { text: 'Black/Hispanic higher cardiovasc. risk', original: 'True', agent: 'True', aligned: true },
      { text: 'Black/Hispanic less medication use', original: 'True', agent: 'True', aligned: true },
      { text: 'Hispanic more depressive symptoms', original: 'True', agent: 'True', aligned: true },
    ],
  },
  {
    id: 'racial-cog',
    shortName: 'Racial Cognitive Disparities',
    topic: 'Racial disparities in actuarial criteria for cognitive impairment and demographically-adjusted z-scores',
    assertions: [
      { text: 'Whites higher rate of low memory scores', original: 'True', agent: 'True', aligned: true },
      { text: 'Whites higher rate of low attention scores', original: 'True', agent: 'True', aligned: true },
      { text: 'Whites higher rate: processing speed', original: 'True', agent: 'True', aligned: true },
      { text: 'Whites higher rate: verbal fluency', original: 'True', agent: 'True', aligned: true },
      { text: 'Whites meeting actuarial MCI criteria', original: '71.6%', agent: '48.9%', aligned: false },
      { text: 'Blacks meeting actuarial MCI criteria', original: '57.9%', agent: '41.3%', aligned: false },
      { text: 'Whites more likely to meet criteria', original: 'True', agent: 'True', aligned: true },
    ],
  },
  {
    id: 'srb',
    shortName: 'SRB Cognitive Indices',
    topic: 'Development and validation of standardized regression-based (SRB) indices for cognitive decline detection',
    assertions: [
      { text: 'SRB equations predict cognitive variables', original: 'True', agent: 'True', aligned: true },
      { text: 'Base rate of ≥1 SRB decline (range)', original: '26.7–58.1%', agent: '5.65–52.0%', aligned: false },
      { text: 'SRB indices show convergent validity', original: 'True', agent: 'True', aligned: true },
      { text: 'CDR-B impairment assoc. with decline', original: 'True', agent: 'True', aligned: true },
    ],
  },
]

function reproRate(study: Study) {
  const n = study.assertions.filter(a => a.aligned).length
  return Math.round((n / study.assertions.length) * 100)
}

export default function AgentReproDemo() {
  const [selectedId, setSelectedId] = useState<string>('ethnoracial')
  const sel = STUDIES.find(s => s.id === selectedId)!

  const rate = reproRate(sel)
  const aligned = sel.assertions.filter(a => a.aligned).length

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Interactive</span>
        <span className={styles.headerTitle}>Agent Reproduction Accuracy by Study</span>
        <span className={styles.headerNote}>Click a study to inspect</span>
      </div>

      <div className={styles.body}>
        {/* Study list */}
        <div className={styles.studyPanel}>
          {STUDIES.map(s => {
            const pct = reproRate(s)
            return (
              <button
                key={s.id}
                className={`${styles.studyRow} ${s.id === selectedId ? styles.studyRowActive : ''}`}
                onClick={() => setSelectedId(s.id)}
                title={`${s.shortName}: ${pct}% reproduced`}
              >
                <span className={styles.studyName}>{s.shortName}</span>
                <span className={styles.studyBarWrap}>
                  <span className={styles.studyBar} style={{ width: `${pct}%` }} />
                </span>
                <span className={styles.studyPct}>{pct}%</span>
              </button>
            )
          })}
          <p className={styles.panelNote}>Avg reproduction: ~53% per study · GPT-4o · Autogen v2</p>
        </div>

        {/* Detail panel */}
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <span className={styles.rateBadge}>{rate}%</span>
            <div className={styles.detailMeta}>
              <span className={styles.detailCount}>{aligned}/{sel.assertions.length} assertions reproduced</span>
              <span className={styles.detailTopic}>{sel.topic}</span>
            </div>
          </div>

          <div className={styles.assertionList}>
            {sel.assertions.map((a, i) => (
              <div key={i} className={`${styles.assertionRow} ${a.aligned ? styles.assertionAligned : styles.assertionMiss}`}>
                <span className={styles.assertionIcon}>{a.aligned ? '✓' : '✗'}</span>
                <span className={styles.assertionText}>{a.text}</span>
                <span className={styles.assertionVals}>
                  <span className={styles.valOrig}>{a.original}</span>
                  <span className={styles.valArrow}>→</span>
                  <span className={`${styles.valAgent} ${a.aligned ? styles.valOk : styles.valFail}`}>{a.agent}</span>
                </span>
              </div>
            ))}
          </div>

          <p className={styles.sourceNote}>
            Source: Dobbins &amp; Xiong et al. · NACC UDS v3 · 5 AD studies, N&nbsp;=&nbsp;35 assertions
          </p>
        </div>
      </div>
    </div>
  )
}
