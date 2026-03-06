# Personal Academic Website

A static personal academic website for GitHub Pages, built with Vite + React + TypeScript.

## Stack

- **Vite + React + TypeScript** — fast build, full type safety
- **CSS Modules** — scoped styles, no heavy CSS framework
- **React Router** — client-side routing
- **JSON content files** — all content is editable without touching component code

---

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview the build locally

```bash
npm run preview
```

---

## Deploy to GitHub Pages

### Option 1: Deploy the `dist/` folder manually

1. Build: `npm run build`
2. Push the contents of `dist/` to the `gh-pages` branch (or use a tool like `gh-pages`):

```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

### Option 2: GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

After pushing, go to **Settings → Pages** in your GitHub repo and set **Source** to the `gh-pages` branch.

### Custom domain (optional)

1. Add a `CNAME` file to `public/` containing your domain:
   ```
   yourdomain.com
   ```
2. Update `baseUrl` in `src/content/config.json`.
3. Update the `base` field in `vite.config.ts` to `'/'` (already set).

---

## How to Update Content

All content lives in `src/content/`. Edit these JSON files — no component changes needed.

### `site.json`
- `name`, `nameShort` — your name and abbreviation (used in nav wordmark)
- `tagline` — one-line description under your name
- `intro` — short paragraph on the home page
- `now` — array of "currently doing" bullet points
- `about` — bio, values, outside-work blurb, philosophy

### `config.json`
- `cv.path` — path to your CV PDF (place in `public/cv/cv.pdf`)
- `scheduling.calendlyUrl` — your Calendly embed URL
- `social.*` — email, GitHub, LinkedIn, Scholar, Twitter

### `research.json`
Array of research theme objects:
```json
{
  "id": "unique-id",
  "title": "Theme Title",
  "description": "...",
  "methods": ["Method A", "Method B"],
  "whyItMatters": "...",
  "icon": "nlp"   // one of: nlp, decision, data, eval, causal
}
```

### `publications.json`
Array of publication objects. Add new ones at the top for most-recent-first display:
```json
{
  "id": "pub-2025-01",
  "title": "Paper Title",
  "authors": ["Your Name", "Co-Author"],
  "venue": "AMIA 2025",
  "year": 2025,
  "type": "conference",   // journal | conference | poster | preprint
  "abstract": "...",
  "links": { "pdf": "", "doi": "", "arxiv": "" },
  "bibtex": "@inproceedings{...}"
}
```

### `projects.json`
Array of project objects. The `id` field maps to which demo is shown:
- `"note-summarization"` → Clinical Note Summarization demo
- `"decision-pathway"` → Decision Pathway Sandbox
- `"cohort-builder"` → Cohort Builder Preview
- `"tradeoff-explorer"` → Tradeoff Explorer

### `questions.json`
Array of question cards for the Notebook/Questions page:
```json
{
  "id": "q13",
  "question": "Your question here?",
  "tags": ["Disease", "Ethics"],
  "note": "A short reflection (shown on expand)."
}
```
Available tags: `Disease`, `Health`, `Severity`, `Causality`, `Decision-making`, `Ethics`, `Measurement`, `Philosophy`

---

## Add your CV

Place your CV PDF at:
```
public/cv/cv.pdf
```

The path is already configured in `config.json`.

---

## Dark Mode

Dark mode is automatic (follows `prefers-color-scheme`) and toggleable via the nav button. The preference is saved in `localStorage`.

---

## Accessibility

- Semantic HTML throughout
- ARIA labels on all interactive elements
- Keyboard-navigable demos (Enter/Space to activate, Escape to close)
- `prefers-reduced-motion` respected on all animations
- Skip-to-main-content link
- Visible focus styles

---

## File Structure

```
src/
├── components/
│   ├── layout/        Nav, Footer, Layout
│   ├── demos/         Project interactive demos
│   ├── EnvelopeIntro  First-visit intro animation
│   └── PipelineDiagram
├── content/           JSON content files (edit here)
├── hooks/             useDarkMode, useReducedMotion
├── pages/             One file per route
├── styles/            global.css, variables.css
├── types.ts           Shared TypeScript types
├── App.tsx            Router setup
└── main.tsx           Entry point

public/
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── 404.html           SPA routing for GitHub Pages
├── .nojekyll          Disable Jekyll processing
└── cv/                Place cv.pdf here
```
