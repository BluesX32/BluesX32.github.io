import { useState } from 'react'
import styles from './PipelineDiagram.module.css'

interface PipelineNode {
  id: string
  label: string
  description: string
}

interface PipelineDiagramProps {
  nodes: PipelineNode[]
}

export default function PipelineDiagram({ nodes }: PipelineDiagramProps) {
  const [active, setActive] = useState<string | null>(null)
  const activeNode = nodes.find(n => n.id === active)

  return (
    <div className={styles.diagram}>
      <div className={styles.nodes} role="list" aria-label="Pipeline steps">
        {nodes.map((node, idx) => (
          <div key={node.id} className={styles.nodeWrap} role="listitem">
            <button
              className={`${styles.node} ${active === node.id ? styles.nodeActive : ''}`}
              onClick={() => setActive(active === node.id ? null : node.id)}
              aria-expanded={active === node.id}
              aria-controls={`pipeline-desc-${node.id}`}
              title={node.label}
            >
              <span className={styles.nodeNum} aria-hidden="true">{idx + 1}</span>
              <span className={styles.nodeLabel}>{node.label}</span>
            </button>
            {idx < nodes.length - 1 && (
              <span className={styles.arrow} aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>

      <div
        id={activeNode ? `pipeline-desc-${activeNode.id}` : undefined}
        className={`${styles.description} ${activeNode ? styles.descriptionVisible : ''}`}
        aria-live="polite"
      >
        {activeNode ? (
          <>
            <strong className={styles.descTitle}>{activeNode.label}</strong>
            <p className={styles.descText}>{activeNode.description}</p>
          </>
        ) : (
          <p className={styles.descHint}>Click any step to learn more.</p>
        )}
      </div>
    </div>
  )
}
