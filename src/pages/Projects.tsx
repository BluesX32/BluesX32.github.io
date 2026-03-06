import { useState } from 'react'
import projectsData from '@/content/projects.json'
import type { Project } from '@/types'
import PipelineDiagram from '@/components/PipelineDiagram'
import NoteSummaryDemo from '@/components/demos/NoteSummaryDemo'
import DecisionPathwayDemo from '@/components/demos/DecisionPathwayDemo'
import CohortBuilderDemo from '@/components/demos/CohortBuilderDemo'
import TradeoffExplorerDemo from '@/components/demos/TradeoffExplorerDemo'
import styles from './Projects.module.css'

const projects = projectsData as Project[]

function getDemoComponent(project: Project) {
  switch (project.id) {
    case 'note-summarization':
      return <NoteSummaryDemo project={project} />
    case 'decision-pathway':
      return <DecisionPathwayDemo project={project} />
    case 'cohort-builder':
      return <CohortBuilderDemo project={project} />
    case 'tradeoff-explorer':
      return <TradeoffExplorerDemo />
    default:
      return null
  }
}

export default function Projects() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="page-content">
      <div className="container">
        <header className={styles.header}>
          <span className="label">Projects</span>
          <h1 className="section-title">Case Studies</h1>
          <p className="section-subtitle">
            Each project is a concrete investigation — a problem encountered, an approach tried,
            a lesson learned. The interactive demos below are synthetic illustrations of the work.
          </p>
        </header>

        <div className={styles.projectList}>
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className={styles.projectCard}
              aria-labelledby={`project-${project.id}`}
            >
              {/* Card header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardIndex} aria-hidden="true">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`tag ${styles.statusTag}`}>{project.status}</span>
                  <div className={styles.cardTags}>
                    {project.tags.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <h2 id={`project-${project.id}`} className={styles.projectTitle}>
                  {project.title}
                </h2>
                <p className={styles.projectSubtitle}>{project.subtitle}</p>
              </div>

              {/* Interactive Demo */}
              <div className={styles.demoArea}>
                {getDemoComponent(project)}
              </div>

              {/* Expandable detail section */}
              <div className={styles.detailSection}>
                <button
                  className={styles.detailToggle}
                  onClick={() => toggle(project.id)}
                  aria-expanded={expanded[project.id] ?? false}
                  aria-controls={`detail-${project.id}`}
                >
                  <span>{expanded[project.id] ? 'Hide details' : 'Show project details'}</span>
                  <span
                    className={styles.toggleChevron}
                    style={{ transform: expanded[project.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </button>

                {expanded[project.id] && (
                  <div id={`detail-${project.id}`} className={styles.detailBody}>
                    <div className={styles.detailGrid}>
                      <DetailBlock label="Problem" text={project.problem} />
                      <DetailBlock label="Approach" text={project.approach} />
                      <DetailBlock label="Impact" text={project.impact} />
                      <DetailBlock label="My Role" text={project.myRole} />
                    </div>

                    <div className={styles.toolsSection}>
                      <span className="label">Tools &amp; Methods</span>
                      <div className={styles.toolTags}>
                        {project.tools.map(t => (
                          <span key={t} className={styles.toolTag}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {project.pipeline.length > 0 && (
                      <div className={styles.pipelineSection}>
                        <span className="label">Pipeline</span>
                        <p className={styles.pipelineHint}>Click any step for a short explanation.</p>
                        <PipelineDiagram nodes={project.pipeline} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DetailBlockProps {
  label: string
  text: string
}

function DetailBlock({ label, text }: DetailBlockProps) {
  return (
    <div className={styles.detailBlock}>
      <span className="label">{label}</span>
      <p className={styles.detailText}>{text}</p>
    </div>
  )
}
