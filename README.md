# LegalAI — Intelligent Legal Chatbot

AI-powered legal assistant for **M&A**, **Private Equity**, and **Litigation** professionals. Provides specialized tools for each practice area with contextual analysis, document drafting, and research capabilities.

## Practice Areas & Skills

### Mergers & Acquisitions
- **Due Diligence Analyzer** — Analyze target documents, identify risks, generate checklists
- **Deal Structure Advisor** — Compare stock/asset purchases, tax implications, earn-outs
- **Regulatory & Antitrust Advisor** — HSR filings, CFIUS, antitrust risk analysis
- **M&A Document Drafter** — LOIs, SPAs, reps & warranties, closing documents
- **Closing Coordinator** — Closing checklists, conditions tracking, funds flow

### Private Equity
- **Fund Formation Advisor** — Fund structuring, LPA drafting, ILPA best practices
- **Portfolio Company Advisor** — Governance, management incentives, add-on acquisitions
- **Term Sheet & Deal Analyzer** — Term sheets, waterfall calculations, leverage analysis
- **LP/GP Agreement Specialist** — Side letters, subscription agreements, MFN provisions
- **Fund Regulatory Advisor** — SEC registration, compliance programs, Form ADV/PF

### Litigation
- **Case Strategy Analyzer** — Claim analysis, defense identification, risk assessment
- **Discovery Manager** — Interrogatories, document requests, deposition outlines, ESI protocols
- **Motion & Brief Drafter** — Motions to dismiss, summary judgment, TROs, appeals
- **Case Timeline Builder** — Deadline calculation, fact timelines, trial prep schedules
- **Settlement Analyzer** — Offer evaluation, agreement drafting, tax-efficient structuring
- **Legal Research Assistant** — Case law research, statutory analysis, jurisdiction comparison

## Setup

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server (frontend + backend)
npm run dev
```

The app runs at `http://localhost:3000` with the API server on port `4000`.

## Configuration

Edit `.env` to configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `4000` |
| `AI_PROVIDER` | AI backend (`openai` or `anthropic`) | `openai` |
| `AI_API_KEY` | API key for AI provider | — |
| `AI_MODEL` | Model name to use | Provider default |

The app works without an API key using built-in response templates. Add an API key for full AI-powered responses.

## Architecture

```
├── server/                  # Express API server
│   ├── routes/              # API route handlers
│   ├── services/            # Practice area AI services
│   ├── middleware/           # Auth, rate limiting
│   └── models/              # Data models (in-memory)
├── src/                     # React frontend (Vite)
│   ├── components/          # Shared UI components
│   ├── pages/               # Route pages
│   ├── hooks/               # React hooks & context
│   └── styles/              # CSS styles
└── public/                  # Static assets
```

## Disclaimer

This application provides AI-assisted analysis for informational purposes only. All outputs require review by a licensed attorney in the applicable jurisdiction. This tool does not constitute legal advice and does not create an attorney-client relationship.
