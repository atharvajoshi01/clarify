# Clarify

AI Business Analyst agent. Drop in a project brief, get back a full BA artifact pack: requirements with unique IDs, a Requirements Traceability Matrix, test cases, and a RACI stakeholder register.

The agent refuses to invent details. If the brief is ambiguous on scope, users, success metrics, integrations, or constraints, it asks clarifying questions before generating anything.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind v4, shadcn/ui
- Vercel AI SDK with OpenRouter (free model, swap via `CLARIFY_MODEL` env)

## Local development

```bash
cp .env.example .env.local
# fill in OPENROUTER_API_KEY
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy

Deploys to Vercel as a standard Next.js app. Set `OPENROUTER_API_KEY` in the Vercel project env vars. Optionally override the default model with `CLARIFY_MODEL`.

## Status

Early MVP. Brief in, clarifying questions or first artifact pack out. Structured artifact rendering, export, and durable multi-step workflow are next.
