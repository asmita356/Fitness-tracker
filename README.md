# Discipline30: Personal Fitness & Discipline Coach

A 30-day fitness and discipline tracker for iPhone. Single web page, no accounts, no cost to run.

## What it does
- Starts with an 8-day starter, then unlocks the full 30-day challenge
- Welcome screen: name, goal, fitness level
- Water, sleep and healthy-meal tracker with a daily Discipline Score (0-100) and score chart
- Workouts with warm-up, cool-down and a form tip each day
- Daily workout (changes by level) and a 5-habit checklist
- Add your own tasks, including repeating daily tasks
- Streak, best streak, 30-day progress map, finish card
- Alarms (ring while the page is open)
- Coach: built-in answers (free, unlimited) or real AI (optional)

## Files
- `index.html`: the whole app
- `manifest.webmanifest`, `icon-180.png`, `icon-512.png`: home-screen name and icon (keep them next to `index.html`)
- `ai-server/worker-free.js`: optional free AI (Cloudflare Workers AI)
- `ai-server/worker-openai-optional.js`: optional paid AI (OpenAI key)

## Run it free (5 minutes)
1. Go to app.netlify.com/drop
2. Drag in the whole folder (keep the icon files next to `index.html`). Vercel works the same way.
3. Open the link on your iPhone in Safari
4. Tap Share, then Add to Home Screen

## Turn on real AI (optional, free allowance)
1. Create a free Cloudflare account, then Workers & Pages, Create, Hello World, Deploy
2. Edit code, paste `ai-server/worker-free.js`, deploy
3. Worker Settings, Bindings, Add, Workers AI, name it exactly `AI`
4. Add variable `ALLOWED_ORIGIN` = your app's web address
5. Copy the Worker URL into `const COACH_URL="";` near the top of the script in `index.html`
6. Upload `index.html` again

Each device gets 5 AI answers a day (`FREE_AI_LIMIT`), then the built-in coach answers.

## Customise for a client
At the top of the script in `index.html`:
- `BRAND`: app name
- `FREE_AI_LIMIT`: AI answers per day
- `WORKOUTS`, `QUOTES`, `CHECKS`: plan content

## Known limits
- Progress is stored on the device only (no sync, no login)
- No payments
- Alarms only ring while the page is open
- General fitness guidance, not medical advice
- Automatically smoke-tested (onboarding, tasks, finish day, streak, coach, alarms); test on a real iPhone before handing to a client

## Next steps if you sell it
Add logins and payments (for example Stripe) with a small backend, and move progress into a database.
