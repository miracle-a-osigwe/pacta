# 🛡️ Pacta — Autonomous Agent Commerce & Escrow Layer

> **Built for the PayPal AI Hackathon: Build What's Next with PayPal and AI**  
> *Enabling safe, verifiable economic autonomy for AI agents powered by PayPal Sandbox and Google Gemini 2.5.*

---

## 💡 The Problem
As AI agents evolve from conversational assistants into autonomous workers capable of writing software, auditing code, translating media, and conducting market research, they face a fundamental roadblock: **they cannot safely participate in real-world commerce**.
- Giving an AI agent unrestricted credit card access is an extreme financial security hazard.
- Human-in-the-loop procurement for digital services and micro-contractors takes days of manual friction.
- Freelancers and provider agents have no guarantee of payment for autonomous work without trusted escrow.

## 🚀 The Solution: Pacta
**Pacta** (Latin for *"agreed terms"*) is an economic coordination and milestone escrow protocol that connects buyer agents and provider agents with cryptographic trust and financial settlement:
1. **Autonomous RFQ & Milestone Negotiation**: A business manager defines a high-level objective and budget. The autonomous **Buyer Agent** negotiates deliverables, timelines, and sequential milestone allocations with provider agents.
2. **PayPal Smart Escrow Funding**: The agreed milestones generate conditional orders via the **PayPal Orders API (v2)**, securely locking escrow funds in the PayPal Sandbox vault.
3. **AI Quality Verification (Gemini AI Judge)**: Once a provider agent submits proof-of-work (code, documentation, translation, or assets), Pacta's **Auditor Agent** conducts multimodal inspection against contractual acceptance criteria, assigning a quality score (0–100%).
4. **Programmatic PayPal Payouts**: If the deliverable satisfies criteria (score ≥ 85%), Pacta automatically triggers the **PayPal Payouts API (v1)** to disburse payment instantly to the provider's PayPal account.
5. **AG Grid Financial Cockpit**: CFOs, treasury managers, and operators monitor all agent-driven commerce in real time via an enterprise **AG Grid** financial command center.

---

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Client ["Frontend (Next.js 16 + React 19 + Tailwind CSS)"]
        UI[Agent Mission Studio]
        Milestones[Milestone Escrow Timeline]
        Cockpit[AG Grid v36 Financial Cockpit]
    end

    subgraph Agents ["AI Agent Core (Google Gemini 2.5)"]
        Planner[Planner & Negotiator Agent]
        Auditor[Multimodal Auditor & AI Judge]
        Guard[Risk & Budget Guardrail]
    end

    subgraph PayPal ["PayPal Developer Platform (Sandbox)"]
        OrdersAPI[PayPal Orders API v2 (Escrow Capture)]
        PayoutsAPI[PayPal Payouts API v1 (Instant Disbursement)]
    end

    UI -->|Objective & Budget| Planner
    Planner -->|Structured Milestones| Milestones
    Milestones -->|1. Fund Escrow| OrdersAPI
    OrdersAPI -->|Escrow Locked| Cockpit
    Milestones -->|2. Submit Deliverable| Auditor
    Auditor -->|3. Score >= 85% Approved| Guard
    Guard -->|4. Trigger Payout| PayoutsAPI
    PayoutsAPI -->|5. Real-Time Settlement Event| Cockpit
```

---

## 🏆 Prize Category Alignment

| Prize Category | How Pacta Fits |
| :--- | :--- |
| **Grand Prize / 1st Place** | Production-ready, end-to-end full-stack solution solving real economic autonomy for AI agents. |
| **Best Use of Agentic Commerce** | Autonomous agents acting as genuine economic buyers, negotiators, and service providers. |
| **Best Use of PayPal + AI** | Synergistic workflow: Gemini handles reasoning & verification; PayPal handles secure escrow and instant payouts. |
| **Best Use of AG Grid** | High-performance enterprise financial grid with real-time status chips, AI audit gauges, and CSV exports. |
| **Best Use of Render** | Production web deployment on Render with unified Next.js SSR and API routes. |

---

## 🎨 Tri-Hybrid Interface Design: Rare, Blended Experience
Pacta eschews standard generic SaaS cards in favor of a bespoke **tri-hybrid UI** that merges three design languages into an unforgettable tactile experience:

1. **Autonomous Topology Conduit Mesh (Layer 1)**:
   - Dynamic SVG conduits connect the **Buyer Agent**, **PayPal Escrow Vault**, **Provider Agent**, and **Gemini AI Judge**.
   - Glowing pulses flow along Bezier pathways indicating active escrow lock, proof-of-work transmission, and instant disbursement.
   - Interactive nodes with telemetry modals providing cryptographic hashes and PayPal API endpoints.

2. **Tactile Hardware Escrow Vouchers (Layer 2)**:
   - Realistic **perforated thermal receipt styling** with sawtooth cut edges and faint diagonal micro-watermarks.
   - **Phosphor LED indicators** with soft glowing radial rings and **10-segment analog LED level meters** that fill dynamically as milestones progress.
   - **Mechanical Web Audio Synthesizer**: In-browser oscillators synthesize tactile mechanical switch clicks, heavy rubber ink-stamp thuds upon audit approval, and fintech cash chimes upon payout disbursement — 100% royalty-free, zero external audio asset dependencies.
   - **Rubber Ink-Stamp**: Bold stamped diagonal overlay (`ESCROW LOCKED`, `AI VERIFIED`, `PAYPAL SETTLED`) rotating dynamically based on contract state.

3. **Bloomberg Terminal & Protocol Telemetry (Layer 3)**:
   - High-density monospace **ASCII Protocol Packet Ticker** docked at the bottom streaming real-time network packets (`[ESCROW_LOCK]`, `[GEMINI_AUDIT]`, `[PAYPAL_DISBURSE]`, `[TAVILY_PROBE]`).
   - Enterprise **AG Grid Community v36** dark Quartz cockpit with column sorting, keyword filtering, status pill renderers, and instant CSV export.

---

## 🔑 BYOK (Bring Your Own Key) & Zero-Crash Resilience
Judges and evaluators can test Pacta with their own live credentials or test immediately out-of-the-box without typing a single key:

- **PayPal Sandbox Credentials**: Supports custom `Client ID` and `Client Secret` via the slide-over settings drawer. Executes real Orders v2 and Payouts v1 calls against PayPal Sandbox (`https://api-m.sandbox.paypal.com`).
- **Google Gemini 2.5 API Key**: Powers autonomous milestone decomposition, price negotiation, and multimodal deliverable verification.
- **Tavily AI Search API Key**: Powers live real-time market rate benchmarking, researching typical freelance and agency market rates for given mission parameters.
- **Client-Side Privacy**: Keys are encrypted in `localStorage` and dispatched per request via custom headers (`x-paypal-client-id`, `x-gemini-key`, `x-tavily-key`).
- **Resilient Fallback Engine**: If any key is missing or invalid, Pacta automatically falls back to deterministic smart heuristics and sandbox mocks with synthetic IDs (`SANDBOX-ORDER-AUTO`, `SANDBOX-BATCH-PAYOUT`). Judges will **never experience a crash or blocking error**.

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- **Node.js**: v20 or higher (v22+ recommended)
- **npm** or **pnpm**
- **PayPal Developer Account**: [developer.paypal.com](https://developer.paypal.com) (Sandbox) *(Optional)*
- **Gemini API Key**: [aistudio.google.com](https://aistudio.google.com) *(Optional)*
- **Tavily Search API Key**: [tavily.com](https://tavily.com) *(Optional)*

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/pacta-agentic-commerce.git
cd pacta-agentic-commerce
npm install
```

### 2. Configure Environment Variables (Optional)
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your sandbox keys in `.env.local`:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!TIP]  
> You can also enter or test your keys anytime using the in-app **"Configure BYOK Keys"** button in the top navigation bar!

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Interactive Demo Walkthrough for Judges

For the fastest and most immersive judging experience:

1. **1-Click 60-Second Auto-Demo**:
   - Click the glowing **"60-Second Auto-Demo"** button in the hero header or open the **"Guide Me"** radar in the navigation bar.
   - Click **"Auto-Play 60s Demo"**.
   - Watch Pacta programmatically negotiate an autonomous RFQ, lock funds into PayPal Escrow, submit proof-of-work, execute Gemini AI audit verification with rubber ink-stamp thud, disburse PayPal Payout with cash chime audio, and switch into the AG Grid Financial Cockpit.
2. **Interactive Step-by-Step Guide**:
   - Browse the 6-stage interactive spotlight modal explaining each phase of agentic escrow.
3. **Manual Exploration**:
   - **Deploy Mission**: Formulate a custom mission or pick a preset (e.g. *Full-Stack Smart Contract Audit* or *Market App Localization*).
   - **Tactile Receipt Actions**: Click **"Fund Escrow via PayPal"**, **"Simulate Agent Delivery"**, and **"AI Verify & Auto-Payout"** on the thermal voucher.
   - **AG Grid Cockpit**: Inspect the immutable settlement ledger and export to CSV.

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
