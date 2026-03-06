import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/global.css'
import App from '@/App'

// Skip-to-main CSS
const skipStyle = document.createElement('style')
skipStyle.textContent = `
  .skip-link {
    position: absolute;
    top: -100%;
    left: var(--space-4);
    background: var(--accent-primary);
    color: #fff;
    padding: var(--space-2) var(--space-4);
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    font-size: var(--text-sm);
    font-family: var(--font-body);
    z-index: 9999;
    text-decoration: none;
    transition: top 150ms;
  }
  .skip-link:focus {
    top: 0;
  }
`
document.head.appendChild(skipStyle)

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
