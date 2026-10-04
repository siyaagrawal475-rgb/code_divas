# HERTRACE — Digital Evidence Preservation & Incident Reconstruction

A full-stack, end-to-end working prototype of **HERTRACE**, a digital evidence preservation and incident reconstruction platform for victims of online impersonation, deepfakes, and unauthorized media dissemination.

Built with a serious, high-integrity security aesthetic (Linear / Vercel / 1Password admin style). The core theme is **TIME**: *"Time preserves the truth."*

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the fullstack development servers (Frontend + Backend)
```bash
npm run dev
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend Vault API**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7
- **Backend API**: Node.js + Express 5 + TypeScript (native Node 24 type execution)
- **Database**: SQLite (Node 24 native `DatabaseSync` in WAL mode)
- **File & Media Storage**: Secure disk vault (`server/uploads/`) with multipart upload pipeline via `multer`
- **Cryptography Engine**: NIST FIPS 180-4 SHA-256 cryptographic digests calculated on both client and backend vault
- **Attestation & Sealing**: Eye of Agamotto cryptographic attestation generator linking case IDs, temporal timestamps, and verified evidence hashes
- **Forensic Intelligence Engine**: Probabilistic heuristic analysis, dynamic dependency graph reconstruction, and formal report compiler
- **Typography & Icons**: Inter, JetBrains Mono, `lucide-react` (16/18px, stroke width 1.5)

---

## 🔒 Design System & Aesthetic Principles

- **Flat surfaces with 1px borders**: No glassmorphism, no neon glows, no gradient text, no blurred blobs.
- **Green Accent Discipline**: Green (`#45E08A`) covers at most 10% of any screen, reserved strictly for verified states, active navigation indicators, primary actions, and timeline nodes.
- **Strict Spacing & Radius Scale**:
  - Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 px
  - Radius: `6px` for inputs/buttons, `10px` for cards.
- **Design Tokens**:
  - Background: `#080A09`
  - Surface: `#101512`
  - Border: `#202A24`
  - Text: `#E8F0EB`
  - Muted Text: `#8B9890`
  - Accent: `#45E08A`
  - Ok / Valid: `#63D6A0`
  - Warning: `#F5B942`
  - Danger: `#FF5C67`
- **Hedged AI Language**: All automated forensic intelligence uses responsible, probabilistic terminology (*"possible"*, *"heuristic indicators suggest"*).

---

## 🧭 Routes and Demo Flow

| Route | Name | Key Functionality |
|---|---|---|
| `/` | **Entry / Landing** | Centered Time Stone-inspired concentric ring motif (rotates on hover), 1.5s intro sequence, quick route launch. |
| `/chronicle` | **Chronicle Dashboard** | Stat telemetry (Active cases, Evidence items, Reports), dense incident table with risk badges, filter and search. |
| `/incident/new` | **Intake Wizard** | 4-step calm intake flow: What happened -> Where found -> Details -> Drag & drop evidence upload with client-side SHA-256 calculation. |
| `/archive` | **Time Archive (Hero)** | Evidence grid with procedural SVG forensic visualizers, truncated SHA-256, signature green ring expansion animation on newly added files, and 360px slide-in metadata detail drawer. |
| `/trace/:id` | **Trace Reconstruction** | 3-column workspace: Key-value case telemetry, interactive SVG dependency graph with hover/click highlights, and hedged AI analysis checklist. |
| `/report/:id` | **Time Trail & Report** | Vertical chronological reconstruction trail ending in the Time Stone-inspired ring node, and an off-white formal incident report preview with staged 4-step PDF generation and download. |

---

## 🧪 End-to-End Walkthrough

1. **Entry (`/`)**: Click **"Create incident"** or explore with **"Open evidence archive"**.
2. **Create Incident (`/incident/new`)**:
   - Step 1: Choose *Deepfake or manipulation* or *Impersonation*.
   - Step 2: Choose target platform (*Instagram*, *WhatsApp*, etc.).
   - Step 3: Enter target account and details.
   - Step 4: Drop any image/video/log file to calculate its SHA-256 hash in real time.
   - Click **"Preserve incident"** to simulate cryptographic anchoring.
3. **Archive (`/archive`)**: Notice the new evidence item highlight with the signature green expanding ring animation settling into a verified locked state. Click the card to open the slide-in drawer.
4. **Trace (`/trace/:id`)**: Explore the evidence dependency graph, hover over nodes to light up connections, and inspect the AI analysis panel.
5. **Report (`/report/:id`)**: View the chronological time trail, click **"Generate PDF"** to watch the staged verification process, and download the sealed report package.
6. **Chronicle (`/chronicle`)**: View the new case actively tracked in the immutable incident list.

---

## ⚖️ Security & Privacy Model

HERTRACE is architected as an isolated client-side vault. Files dropped into the interface are hashed locally inside the browser using NIST FIPS 180-4 SHA-256 algorithms. No user media or credentials ever leave the device.
