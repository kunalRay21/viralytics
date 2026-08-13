# Viralytics — AI-Powered Viral Potential Analyzer (MVP)

Viralytics is an AI-powered analyzer that estimates the viral potential of short-form video clips (Reels, Shorts, TikToks) prior to posting. It scans content pacing, vocal hooks, sound quality, and captions to generate a **Viral Potential Index (VPI)** alongside actionable editing suggestions.

## 🚀 Key Features

1. **Deterministic Seeded PRNG Engine**: Analysis results are generated based on a 32-bit FNV-1a hash of the video's filename and size, ensuring that the same video filename always yields identical, consistent reports.
2. **Postgres & In-Memory Fallback Repositories**: Bootstraps using PostgreSQL when available. If database connectivity fails, it seamlessly falls back to a temporary, in-memory repository layer without crashing.
3. **Interactive Virality Simulator**: Recalculates projected score shifting client-side. Adjust ranges for hooks, caption strength, voice intensity, ending pacing, and CTA power to review live-tweeter results.
4. **AI Video Doctor**: Outputs diagnoses rating lists (visual hook, pacing, noise control) paired with numbered prescription cards mapping specific visual cuts or audio modifications.
5. **Caption Analyzer & Suggested Copy**: Heuristically scores caption readability, curiosity cues, keyword search indexing, and CTA tags. Fetches category-specific template copy which swaps in upon selection.
6. **Detailed Charts (Recharts)**: Plots visual intro pacing curves (0-3s), timeline retention models with reference flags for drops or peaks, and emotional levels (curiosity, excitement, humor, surprise) over time.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion (visual entries & page layout transitions), Recharts (data plots), Lucide React (indicators).
- **Backend**: Node.js, Express, TypeScript, ts-node-dev.
- **Database**: PostgreSQL (pg client pool) with an automated InMemory runtime database fallback.

---

## 📂 Project Structure

```
viralytics/
├── frontend/                 # Vite React TypeScript client
│   ├── src/
│   │   ├── components/       # Presentational & Recharts widgets (ScoreRing, ProgressBar, etc.)
│   │   ├── components/analysis/ # Audit dashboard section panels (Hook, Retention, Doctor, etc.)
│   │   ├── pages/            # Page templates (Landing, Dashboard, Analyze, Analysis, Report)
│   │   ├── layouts/          # View frameworks (MarketingLayout, AppShell)
│   │   ├── hooks/            # Custom hooks (useCountUp)
│   │   ├── services/         # API wrappers (fetch client with ApiError catching)
│   │   ├── utils/            # Shared calculations (Scoring, Simulator)
│   │   └── index.css         # Tailwind imports and glassmorphic styling
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── routes/           # Routing controllers (dashboard, analyze, caption, etc.)
│   │   ├── services/         # Scoring engines, PRNG providers, simulation helpers
│   │   ├── db/               # DB connections, migrations, repository layers, and seed scripts
│   │   └── index.ts          # Express entrypoint config
└── README.md
```

---

## ⚙️ Installation & Running

Both backend and frontend servers are pre-configured to run. To start them manually:

### 1. Backend Setup
```bash
cd backend
npm install
npm run migrate   # Applies database table schemas if Postgres is available
npm run seed      # Generates 5 initial analyses (automatic fallback to memory if offline)
npm run dev       # Boots Express API on http://localhost:4000
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev       # Starts Vite client on http://localhost:5173
```

---

## 🔌 API Routes Summary

- `GET  /api/dashboard`: Fetches global upload counts, weekly stats, top category, and historic VPI progress line charts.
- `POST /api/analyze`: Receives `{ filename, sizeBytes, durationSeconds }` and saves reports.
- `GET  /api/analysis/:id`: Retrieves full `AnalysisResult` configurations.
- `POST /api/simulate`: Simulates adjusting scores.
- `POST /api/caption/analyze`: Heuristically scores caption copy metrics.
- `POST /api/caption/generate`: Fetches category suggested captions.
- `GET  /api/trends`: Alignment metrics for trend categories.

---

## ⚖️ Accuracy Disclosure
*All scoring mechanics, retention paths, and recommendations are simulated estimates computed from content metrics. Viralytics does not claim direct backend access to internal proprietary databases from Instagram, TikTok, or YouTube.*
