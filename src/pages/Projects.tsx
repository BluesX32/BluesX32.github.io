import { useState } from 'react'
import projectsData from '@/content/projects.json'
import type { Project } from '@/types'
import PipelineDiagram from '@/components/PipelineDiagram'
import NoteSummaryDemo from '@/components/demos/NoteSummaryDemo'
import DecisionPathwayDemo from '@/components/demos/DecisionPathwayDemo'
import CohortBuilderDemo from '@/components/demos/CohortBuilderDemo'
import TradeoffExplorerDemo from '@/components/demos/TradeoffExplorerDemo'
import ClaimsEHRDemo from '@/components/demos/ClaimsEHRDemo'
import styles from './Projects.module.css'

function GitHubIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
}

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
    case 'claims-ehr-gap':
      return <ClaimsEHRDemo />
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

                    {project.links && project.links.length > 0 && (
                      <div className={styles.linksSection}>
                        <span className="label">Code &amp; Resources</span>
                        <div className={styles.projectLinks}>
                          {project.links.map(link => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.projectLink}
                            >
                              <GitHubIcon />
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

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
