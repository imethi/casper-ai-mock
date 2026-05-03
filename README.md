# CASPer AI Mock Backend + Frontend

This is a GitHub-ready mock of a CASPer practice app with:

- Free-tier rule engine with **zero AI token cost**
- Optional Pro-tier AI grading endpoint
- Highlighted positive/negative phrases
- Q4 rewrite suggestions
- Weakness pattern collection
- Scenario bank with 4 free scenarios and 1 paid-style scenario

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Optional AI mode

The app works without an API key using mock AI feedback.

To use real AI feedback, create `.env.local`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Then restart:

```bash
npm run dev
```

## Backend flow

```txt
Frontend → /api/grade → Router
                       ├─ Free user → rule engine → no tokens
                       └─ Pro user → AI engine → OpenAI structured JSON feedback
```

## Files

```txt
app/page.tsx              UI
app/api/grade/route.ts    API endpoint
lib/router.ts             free/pro routing logic
lib/ruleEngine.ts         zero-cost grading logic
lib/aiEngine.ts           AI grading logic
lib/prompt.ts             CASPer evaluator prompt + JSON schema
data/scenarios.ts         scenario bank
```
