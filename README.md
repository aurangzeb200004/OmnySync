# OmniSync: Universal Real-Time Data & Tool Orchestration Engine

A high-performance, developer-first web application showcasing **OmniSync**, engineered for **Muhammad Aurangzeb's** flagship engineering portfolio.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aurangzeb200004/OmnySync)

---

## 🚀 Key Modules & Architecture

### 1. Interactive Visual Pipeline Studio
- **Bezier Canvas Packet Engine**: Real-time packet routing emerging dynamically from source nodes, converging through the core runtime engine, and propagating to destination sinks with particle trails.
- **Node Inspector Modals**: Click any of the 9 nodes (PostgreSQL CDC, Stripe, GitHub, Shopify, Supabase, Snowflake, Elasticsearch, Slack, or OmniSync Core) to inspect live replication lag, connection strings, buffer allocations, and trigger diagnostic test pings.
- **Traffic Controls**: Toggle stream playback (Pause / Resume) or inject synthetic bursts (+3,500 events) directly into the in-flight Redis BullMQ queue.
- **Daemon Worker Console**: Live terminal audit log showing WAL LSN commits, Wasm compilation passes, and destination cluster acknowledgments.

### 2. Deterministic Conflict Resolution Playground
- **4 Real-World Collision Scenarios**:
  - *DevOps*: GitHub Issue vs Jira Ticket (`status`, `priority`, `assignee`)
  - *FinTech*: Stripe Charge vs ERP Ledger (`amount_cents`, `tax_exempt`, `reconciliation_status`)
  - *E-Commerce*: Shopify Inventory vs Warehouse WMS (`stock_count`, `reserved_units`, `warehouse_zone`)
  - *Identity*: PostgreSQL CDC vs Auth0 Directory (`role`, `mfa_enabled`, `permissions`)
- **4 Resolution Algorithms**:
  - *Source Wins (Last Write Wins Timestamp)*
  - *Destination Lockdown (System of Record Authority)*
  - *Field-Level CRDT Deep Merge (Vector Clocks)*
  - *AI Semantic Reconciliation (LLM Contextual Arbitration)*
- **Random Collision Generator**: Simulates edge-case collisions with mathematical epoch delta metrics.

### 3. Visual Schema Field Mapper & Real In-Memory Transform Engine
- **Declarative Rule Builder**: Modal-driven interface supporting 8 transformation operators (Currency float division, ISO-8601 UTC date normalizer, SHA-256 PII masking, E.164 phone normalizer, XSS sanitization, uppercase stringification, tax multiplier, and JSON flattening).
- **Interactive Dry-Run Simulator**: Evaluates active transformation rules directly against editable JSON records with real-time execution benchmarks (`< 0.3ms` latency).

### 4. Live Worker Telemetry & Webhook Ingress Stream
- **Dynamic Observability Gauges**: Live sub-second updates for ingestion rate (TPS), Redis buffer occupancy, P99 latency, and auto-resolved conflict counts.
- **Hero Global Sync Counter**: Live ticking odometer tracking over 42+ million global synchronization events.
- **Ingress Event Feed**: Auto-updating WebSocket audit stream with clear, pause, and filter capabilities.

### 5. Developer API & SDK Sandbox
- **Multi-Language SDK Switcher**: High-fidelity syntax-highlighted code implementations for **TypeScript**, **Python**, **Go**, and **cURL** with one-click clipboard copying.
- **Interactive Synthetic Webhook Dispatcher**: Select payload presets (Stripe, GitHub, PostgreSQL, Shopify) and POST synthetic payloads with instant roundtrip latency calculation, trace IDs, canvas packet animation, and telemetry stream injection.

---

## ⚡ Deployment to Vercel (Zero Configuration)

This repository is pre-configured with `vercel.json`, optimized caching headers, and edge serverless API endpoints for 1-click deployment on [Vercel](https://vercel.com):

### Method A: One-Click Deploy Button
Click the button below to deploy your own instance to Vercel automatically:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aurangzeb200004/OmnySync)

### Method B: Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select **`aurangzeb200004/OmnySync`**.
3. Leave all default settings (*Framework Preset: Other*, *Root Directory: ./*).
4. Click **Deploy**. Vercel will complete deployment in under 15 seconds.

### Method C: Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts (accept defaults by pressing Enter).

---

## 🛠 Edge Serverless Endpoints Included
When deployed on Vercel, the following serverless routes are automatically active:
- **`GET /api/health`**: Returns cluster health, active worker count, uptime, and engine status.
- **`POST /api/webhook`**: Ingestion endpoint accepting synthetic payloads and returning delivery acknowledgments with trace IDs.

---

## 💻 Local Development

Run using Node.js:
```bash
npm start
```
Or using Python's built-in web server:
```bash
python -m http.server 3000
```
Navigate to: `http://localhost:3000`

---

## 📂 Project Structure
```
omnisync-engine/
├── index.html              # Modern, responsive single-page web application
├── vercel.json             # Vercel deployment configuration, headers & routing
├── package.json            # Node & Vercel project metadata and scripts
├── .vercelignore           # Ignored files for lightweight deployment
├── api/
│   ├── health.js           # Serverless edge health endpoint (/api/health)
│   └── webhook.js          # Serverless edge ingestion endpoint (/api/webhook)
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom animations, syntax tokens, and styling
│   └── js/
│       └── main.js         # Canvas packet engine, conflict simulator & Wasm transforms
├── server.js               # Standalone local HTTP server with API routing
└── README.md               # Technical overview & deployment guide
```
