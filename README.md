# eKaisen Clicker

Full-stack idle/clicker factory optimization game built for the eKaisen technical challenge.

The player starts with an inefficient production line and spends eKaisen points on continuous-improvement upgrades such as 5S, Kanban, Poka-Yoke, TPM, Andon, and Heijunka. The game updates production, defects, and OEE in real time, then saves scores to a validated backend ranking API.

## What Is Included

- React + Vite + TypeScript frontend
- NestJS + TypeScript backend
- Firebase Hosting for the frontend
- Firebase Cloud Functions for the API
- Cloud Firestore persistence for ranking scores
- Axios HTTP integration between frontend and backend
- Strict frontend TypeScript
- DTO validation with `class-validator`
- Score plausibility validation on the backend
- Local in-memory backend storage fallback when Firebase is not configured

## Live URLs

Frontend:

```txt
https://ekaisen-clicker.web.app
```

Backend Function:

```txt
https://southamerica-east1-ekaisen-clicker.cloudfunctions.net/api
```

## Game Rules

Initial factory state:

| Metric | Initial value |
| --- | ---: |
| Production speed | 1 piece/second |
| Defect rate | 30% |
| OEE | 40% |

Each good piece gives `1` eKaisen point. Defective pieces are visualized but do not generate points.

Improvements can be bought up to 5 times each:

| Improvement | Base cost | Effect |
| --- | ---: | --- |
| 5S | 50 pts | -5% defects, +10% speed |
| Kanban | 200 pts | +20% speed |
| Poka-Yoke | 500 pts | -15% defects |
| TPM | 1,500 pts | +15% OEE, -10% defects |
| Andon | 4,000 pts | Unlocks auto-recovery concept |
| Heijunka | 10,000 pts | Levels production, +25% OEE |

Upgrade cost scales geometrically:

```txt
cost_n = baseCost * 1.5 ^ purchases
```

The production loop uses elapsed time instead of trusting React render frequency. The app stores a local snapshot and computes offline progress from `lastSavedAt`, so refreshing or returning after time away advances the game state.

## Frontend

Location:

```txt
frontend/
```

Main choices:

- React function components with hooks
- Component folders with paired `.tsx` and `.styled.tsx` files
- `styled-components` for UI styling
- Chart.js for live production and defect charts
- Custom OEE gauge
- Axios API layer in `src/api`
- Game rules isolated in `src/game`

Example structure:

```txt
frontend/src/
  api/
  components/
    FactoryStage/
      FactoryStage.tsx
      FactoryStage.styled.tsx
  game/
  hooks/
  types/
```

Frontend environment:

```env
VITE_API_BASE_URL=http://localhost:3000
```

For deployed hosting:

```env
VITE_API_BASE_URL=https://southamerica-east1-ekaisen-clicker.cloudfunctions.net/api
```

Run locally:

```bash
cd frontend
yarn install
yarn dev
```

Build:

```bash
yarn build
```

Deploy hosting:

```bash
firebase deploy --only hosting
```

## Backend

Location:

```txt
backend/
```

Main choices:

- NestJS REST API
- DTOs validated with `class-validator`
- Firestore repository for production persistence
- In-memory repository fallback for local work without Firebase
- Score plausibility checks because the client is treated as hostile

Backend environment:

```env
FIREBASE_PROJECT_ID=ekaisen-clicker
CORS_ORIGINS=http://localhost:5173,https://ekaisen-clicker.web.app,https://ekaisen-clicker.firebaseapp.com
```

For local backend testing without Firebase:

```env
SCORES_STORAGE=memory
```

Run locally:

```bash
cd backend
yarn install
SCORES_STORAGE=memory yarn start:local
```

Build:

```bash
yarn build
```

Deploy Functions:

```bash
firebase deploy --only functions
```

## API

Base URL locally:

```txt
http://localhost:3000
```

Base URL deployed:

```txt
https://southamerica-east1-ekaisen-clicker.cloudfunctions.net/api
```

### Save Score

```http
POST /scores
Content-Type: application/json
```

```json
{
  "playerName": "Hector",
  "score": 1200,
  "improvements": {
    "5S": 2,
    "Kanban": 1,
    "Poka-Yoke": 0,
    "TPM": 0,
    "Andon": 0,
    "Heijunka": 0
  },
  "elapsedSeconds": 180
}
```

Behavior:

- New player names create ranking entries.
- Existing player names update only if the new score is higher.
- Implausible scores return HTTP `422`.

### Top Ranking

```http
GET /scores/top?limit=10
```

### Player Rank

```http
GET /scores/me?playerName=Hector
```

## Persistence Choice

The project uses Cloud Firestore for ranking persistence.

Firestore fits this challenge because it is managed, works naturally with Firebase Functions, has a local emulator path, and supports the required ranking reads with simple ordered queries. Each score is stored in the `scores` collection using the normalized player name as the document id, which enforces one ranking record per player.

## Anti-Cheat Boundary

The frontend is intentionally not trusted.

Client state is stored in `localStorage` for player convenience and offline progress calculation, but the backend validates every submitted score. The current plausibility rule is:

```txt
max plausible score = elapsedSeconds * 100 + 1000
```

That rule is generous enough for normal play and timer drift, but rejects obvious payloads such as `999999` points after `5` seconds.

## Verification

Commands used during development:

```bash
cd frontend
yarn lint
yarn build
```

```bash
cd backend
yarn build
```

Smoke-tested backend endpoints:

```bash
GET /scores/top?limit=10
POST /scores
GET /scores/me?playerName=Hector
```

Also verified:

- CORS from Firebase Hosting origin
- `422` response for implausible score
- Function deploy status as ACTIVE

## Notes

- `.env` files are intentionally ignored and should not be committed.
- Firebase project identifiers remain lowercase where required by Firebase.
- The deployed Cloud Function currently targets Node.js 20 because that is the configured Firebase runtime.
