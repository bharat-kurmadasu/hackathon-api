# Hackathon API

An AI-powered API endpoint using Claude to answer any question.

## Endpoint

`POST /api/answer`

### Request
```json
{
  "query": "What is 10 + 15?",
  "assets": ["https://optional-asset-url.com"]
}
```

### Response
```json
{
  "output": "The sum is 25."
}
```

---

## 🚀 Deploy to Vercel in 3 Steps

### Step 1 — Install Vercel CLI & Deploy
```bash
npm i -g vercel
cd hackathon-api
vercel
```
Follow the prompts (default options are fine). At the end you'll get a URL like:
`https://hackathon-api-xxx.vercel.app`

Your API endpoint will be:
`https://hackathon-api-xxx.vercel.app/api/answer`

### Step 2 — Add your Anthropic API Key as an Environment Variable
```bash
vercel env add ANTHROPIC_API_KEY
```
Paste your key when prompted, select all environments, press Enter.

Then redeploy:
```bash
vercel --prod
```

### Step 3 — Submit to the Hackathon
Paste this URL in the submission box:
```
https://your-project.vercel.app/api/answer
```

---

## Test Locally
```bash
npm i -g vercel
vercel dev
```
Then in another terminal:
```bash
curl -X POST http://localhost:3000/api/answer \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 10 + 15?", "assets": []}'
```
Expected: `{"output":"The sum is 25."}`
