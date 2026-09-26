# NeuroFlow — Adaptive Institutional Knowledge & Onboarding Graph

NeuroFlow maps an organization's scattered knowledge — Slack threads, docs, tickets,
tribal know-how — into one interactive graph, so new hires ramp up faster and
expertise doesn't walk out the door when someone leaves.

Portfolio project. Backend: Node/Express + TypeScript + MySQL. Frontend: React +
TypeScript + Tailwind, with a 3D force-directed knowledge graph.

## Features (this MVP)

- **Knowledge graph** — nodes (departments, projects, concepts, documents) and
  edges between them, each node status-coded active / dormant / knowledge gap.
  Click a node in the 3D graph to open its "Knowledge Cluster" panel: description,
  connected nodes, and who's tagged as knowing it.
- **Role-adaptive onboarding trails** — ordered, step-by-step paths built from
  real graph nodes, assigned per role, with progress tracking.
- **Expertise routing** — pick the project/concept you're blocked on and get
  ranked matches: who's tagged as an expert on it, or on something directly
  connected to it.
- **Tribal knowledge capture** — short prompts sent to senior staff that turn
  their answers into linked, searchable institutional memory.

> **Honest scope note:** the original spec described live, real-time ingestion
> from Slack/Notion/Jira and AI-generated onboarding content. Those need OAuth
> app registrations and API keys this project doesn't have, so this MVP models
> the graph, routing, and trails as real, working features fed by manual entry
> instead of live third-party ingestion — the same architecture a live
> integration would plug into later.

## Tech stack

- Backend: Node.js, Express, TypeScript, MySQL (`mysql2`), JWT auth, bcrypt
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, `react-force-graph-3d`
  (Three.js under the hood), React Router, Axios

## Project structure

```
NeuroFlow/
  backend/    Express API (auth, nodes/edges, trails, expertise, surveys)
  frontend/   React app (glassmorphic dark UI, 3D graph, dashboard)
```

## Getting started

### 1. Database

Create a MySQL database and run the schema:

```bash
mysql -u root -p -e "CREATE DATABASE neuroflow_db"
mysql -u root -p neuroflow_db < backend/src/db/schema.sql
# optional demo data:
mysql -u root -p neuroflow_db < backend/src/db/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in your DB password and a JWT secret
npm install
npm run dev             # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Register a user in the app, then use the Knowledge Graph tab to add nodes and
edges, Expertise Routing to tag yourself as knowing one, and Onboarding Trails /
Tribal Knowledge from there.

## Design

Glassmorphic cyber-minimalism: obsidian background (`#0B0E14`), translucent glass
panels, electric cyan (`#00F2FE`) and neon purple (`#8A2387`) accents, Space
Grotesk for display type and Inter for body text.

## Roadmap / future improvements

- Real ingestion connectors (Slack, Notion, Jira) behind the same node/edge model
- LLM-assisted auto-tagging of ingested text into graph nodes
- Full-text search across nodes and survey responses
- Admin UI for managing users and expertise tags
