# SignalSprint

A free-to-launch daily visual puzzle game built with Next.js.

## Where each file goes

- `app/page.js` = homepage
- `app/layout.js` = root app layout
- `app/globals.css` = global styles
- `components/GameClient.js` = game UI and guessing logic
- `data/puzzles.json` = 1000-puzzle content bank
- `lib/pickDailyPuzzle.js` = automatic daily selector
- `package.json` = project dependencies and commands

## Run locally

```bash
npm install
npm run dev
```

## Push to GitHub

1. Create a new empty GitHub repository.
2. Upload all files from this folder.
3. Commit and push.

## Deploy free on Vercel

1. Go to Vercel.
2. Sign in with GitHub.
3. Import this repo.
4. Click Deploy.
5. Your site goes live on a free `.vercel.app` URL.
