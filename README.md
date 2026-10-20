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

## ⚡ Quick Start & Run Instructions

### Prerequisites
- **Node.js**: v20 or higher (v22+ recommended)
- **npm** or **pnpm**
- **PayPal Developer Account**: [developer.paypal.com](https://developer.paypal.com) (Sandbox)
- **Gemini API Key**: [aistudio.google.com](https://aistudio.google.com) *(Optional: Pacta includes built-in smart heuristics if API key is not supplied)*

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/pacta-agentic-commerce.git
cd pacta-agentic-commerce
npm install
```

### 2. Configure Environment Variables
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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!NOTE]  
> If you run Pacta without PayPal or Gemini keys, it automatically runs in **Sandbox Fallback Mode** with synthetic transaction IDs and simulated agent reasoning, allowing full evaluation of the UI, AG Grid cockpit, and workflows!

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

1. **Active Missions**: Browse existing pre-seeded autonomous contracts (e.g., *Full-Stack Security Audit* or *App Localization*).
2. **Fund Escrow**: Click **"Fund Escrow via PayPal ($160)"** on any pending milestone to simulate or execute PayPal order capture. Notice the status transitions to `ESCROW_FUNDED`.
3. **Simulate Agent Delivery**: Click **"Simulate Agent Delivery"** to submit proof-of-work (code, audit report, or assets).
4. **AI Audit & Auto-Payout**: Click **"AI Verify & Auto-Payout"**. The Gemini AI Judge audits the submission against criteria. Upon approval (score 94/100), the PayPal Payouts API automatically disburses funds.
5. **AG Grid Financial Cockpit**: Switch to the **AG Grid Cockpit** tab to inspect the real-time financial ledger, filter by transaction type, search by keyword, and export a CSV audit report.
6. **Deploy New Mission**: Switch to the **Deploy Agent** tab, select a preset (or type a custom prompt), and watch the Planner Agent formulate a new milestone contract!

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
