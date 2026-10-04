# CHRONOVAULT — Digital Evidence Vault & Incident Reconstruction

> **"Preserve Every Moment. Protect Every Trace."**  
> Developed by **Team Code Divas** for victims of online abuse, impersonation, deepfakes, and non-consensual media distribution.

CHRONOVAULT is a private, client-side digital evidence vault that turns a chaotic incident into a tamper-evident, report-ready case file across 6 structured phases: **Discover > Preserve > Verify > Organise > Understand > Report**.

It prepares and certifies the formal evidence dossier under **Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA 2023)**; official filing is completed on [cybercrime.gov.in](https://cybercrime.gov.in).

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💎 The Time Stone Theme & Design System

The visual language is an original, forensic-grade interpretation of the **Time Stone / Eye of Agamotto** sacred geometry:

- **Original Sacred Geometry Artwork**:
  - Concentric rings, 8-point & 9-point star polygons, outer chronometric bezel ticks, and rune-like glyphs rendered in pure inline SVG `<TimeSigil />`.
  - Counter-rotating rings with configurable speed, size, and intensity.
  - Fast spin-up during cryptographic SHA-256 calculation that settles with a soft green pulse and temporal-echo ghost trail.
  - Lens-flare radial light center and subtle ambient drifting dust particles (<40 particles canvas).
- **Temporal Green Palette (5–10% Screen Accent)**:
  - Base: Near-black (`#0A0C0B` to `#121513`) with subtle 3% grain noise texture.
  - Emerald Temporal Green: `#2FE08F` / `#3DDC84`, `#1F8F5F` for deep fills, `#9AFFC4` for bright indicators. Green is reserved strictly for active states, key verification data, and edge light spills.
  - Light Theme: Warm off-white paper (`#F5F6F3`) with dark green hairlines and ink text (`#111513`), WCAG AA compliant.
- **Typography**:
  - **Display / Section Labels**: `Manrope` (weights 200–300, uppercase, `0.18–0.28em` tracking).
  - **Body / UI**: `Inter` / `Manrope` (weights 400–500 at 15–16px, high contrast).
  - **Hashes, Timestamps & IDs**: `JetBrains Mono` with tabular numbers.
- **Microcopy & Responsible AI**:
  - Plain, warm, non-technical microcopy (*"tamper-evident"*, *"supports your complaint"*).
  - Automated analysis always uses hedged, probabilistic wording (*"possible manipulation"*, e.g. 78% confidence) with the clear disclaimer: *"Supporting analysis only, not a verdict."*

---

## 🧭 The 6 Core Screens

| Route | Phase | Key Capabilities |
|---|---|---|
| `/` | **1. Entry / Landing** | Slow-rotating Eye of Agamotto `<TimeSigil />`, CHRONOVAULT wordmark, 6-phase workflow strip, Today vs. With CHRONOVAULT comparative analysis, and persistent Quick Exit. |
| `/chronicle` | **2. Chronicle** | Case ledger of compact cards (`CV-002`, `CV-001`, etc.), summary telemetry with watch bezel ticks, search and filter chips, and calm empty state. |
| `/incident/new` | **3. Guided Intake** | 4-step intake stepper (Classification, Platform, Identifiers, Evidence), autosave indicator, and *"You can stop and come back"* reassurance line. |
| `/archive` | **4. Time Archive** | Drag-and-drop vault, real in-browser Web Crypto SHA-256 hashing, truncated hashes with copy buttons, "Re-verify" instant check, and client-side isolation guarantee. |
| `/trace/:id` | **5. Correlation Trace** | Interactive node-link graph (account, endpoint URL, image, hash seal), time scrub slider with step-by-step playback, and `<RiskMeter />` with rule-based heuristic factors. |
| `/report/:id` | **6. Attestation Report** | Chronological Time Trail next to a live preview of the formal report sheet with a faint watermark sigil, Section 63 BSA 2023 certificate, cybercrime.gov.in checklist, and download packet. |

---

## 🔒 Client-Side Cryptographic Vault

CHRONOVAULT operates purely client-side without storing user media on remote servers. Files dropped into the vault are hashed in browser memory using the native Web Crypto API (`window.crypto.subtle.digest('SHA-256')`). Zero files or credentials ever leave your machine.
