import { useState } from 'react'
import type { Project } from '@/types'
import styles from './DecisionPathwayDemo.module.css'

interface DecisionPathwayDemoProps {
  project: Project
}

export default function DecisionPathwayDemo({ project }: DecisionPathwayDemoProps) {
  const nodes = project.decisionNodes ?? []
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const active = nodes.find(n => n.id === activeNode)

  return (
    <div className={styles.demo}>
      <div className={styles.demoHeader}>
        <span className="label">Severity Framework · Sickle Cell Disease</span>
        <span className={`tag`}>Click a node to explore</span>
      </div>

      <div className={styles.splitView}>
        {/* SVG pathway */}
        <div className={styles.pathwayPanel} aria-label="Decision pathway diagram">
          <svg
            viewBox="0 0 560 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.svg}
            role="img"
            aria-label="Clinical decision pathway with 5 nodes"
          >
            {/* Edges */}
            <line x1="84" y1="120" x2="176" y2="80" stroke="var(--border-medium)" strokeWidth="1.5"/>
            <line x1="84" y1="120" x2="176" y2="180" stroke="var(--border-medium)" strokeWidth="1.5"/>
            <line x1="224" y1="60" x2="316" y2="120" stroke="var(--border-medium)" strokeWidth="1.5"/>
            <line x1="224" y1="180" x2="316" y2="120" stroke="var(--border-medium)" strokeWidth="1.5"/>
            <line x1="364" y1="120" x2="456" y2="120" stroke="var(--border-medium)" strokeWidth="1.5"/>

            {/* Arrow markers */}
            {[
              { x1: 84, y1: 120, x2: 176, y2: 80 },
              { x1: 84, y1: 120, x2: 176, y2: 180 },
              { x1: 224, y1: 60, x2: 316, y2: 120 },
              { x1: 224, y1: 180, x2: 316, y2: 120 },
              { x1: 364, y1: 120, x2: 456, y2: 120 },
            ].map((edge, i) => {
              const dx = edge.x2 - edge.x1
              const dy = edge.y2 - edge.y1
              const len = Math.sqrt(dx * dx + dy * dy)
              const ux = dx / len
              const uy = dy / len
              const tx = edge.x2 - ux * 30
              const ty = edge.y2 - uy * 30
              return (
                <polygon
                  key={i}
                  points={`${tx},${ty} ${tx - uy * 5 - ux * 8},${ty + ux * 5 - uy * 8} ${tx + uy * 5 - ux * 8},${ty - ux * 5 - uy * 8}`}
                  fill="var(--border-medium)"
                  opacity="0.7"
                />
              )
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  fill={activeNode === node.id ? 'var(--accent-primary)' : 'var(--bg-surface)'}
                  stroke={activeNode === node.id ? 'var(--accent-primary)' : 'var(--border-medium)'}
                  strokeWidth={activeNode === node.id ? 2 : 1.5}
                  style={{ cursor: 'pointer', transition: 'fill 200ms, stroke 200ms' }}
                  onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveNode(activeNode === node.id ? null : node.id) } }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Node: ${node.label}`}
                  aria-pressed={activeNode === node.id}
                />
                <text
                  x={node.x}
                  y={node.y + 50}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-body)"
                >
                  {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
                </text>
                {/* Node number */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={activeNode === node.id ? '#fff' : 'var(--accent-primary)'}
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="var(--font-body)"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.id.replace('n', '')}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        <div className={styles.infoPanel} aria-live="polite" aria-label="Node details">
          {active ? (
            <div className={styles.nodeInfo}>
              <h4 className={styles.nodeTitle}>{active.label}</h4>
              <div className={styles.infoGroup}>
                <span className="label">Rationale</span>
                <p className={styles.infoText}>{active.rationale}</p>
              </div>
              <div className={styles.infoGroup}>
                <span className="label">Data features</span>
                <div className={styles.featureTags}>
                  {active.features.map(f => (
                    <span key={f} className="tag">{f}</span>
                  ))}
                </div>
              </div>
              <div className={styles.infoGroup}>
                <span className="label">Connection to the framework</span>
                <p className={styles.infoText}>{active.next}</p>
              </div>
            </div>
          ) : (
            <div className={styles.emptyInfo}>
              <PathwayIcon />
              <p>Select a level to see how severity manifests — and how it is measured — at that point in the causal chain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PathwayIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" opacity="0.3">
      <circle cx="8" cy="20" r="5"/>
      <circle cx="22" cy="10" r="5"/>
      <circle cx="22" cy="30" r="5"/>
      <circle cx="36" cy="20" r="5"/>
      <line x1="13" y1="18" x2="17" y2="13"/>
      <line x1="13" y1="22" x2="17" y2="27"/>
      <line x1="27" y1="12" x2="31" y2="18"/>
      <line x1="27" y1="28" x2="31" y2="22"/>
    </svg>
  )
}
