# AI Insight Generator

Paste text, click **Generate Insights**, and get a summary, three key takeaways, and a suggested title powered by Cohere.

## Stack
- Next.js (App Router)
- Tailwind CSS
- Cohere `command-r7b-12-2024` via serverless API route

## Getting started
1) Install dependencies
```bash
npm install
```

2) Create `.env.local` with Cohere key
```bash
echo "COHERE_API_KEY=your_cohere_api_key" > .env.local
```

3) Run the dev server
```bash
npm run dev
```

4) Lint
```bash
npm run lint
```

5) Build (Vercel uses this)
```bash
npm run build
```

## Deployment (Vercel)
- Add `COHERE_API_KEY` to Vercel Project Settings → Environment Variables.
- `vercel --prod` (or push to GitHub and connect the repo).
