# eKaisen Clicker Backend

NestJS API for the eKaisen Clicker ranking system. The backend runs locally as a normal HTTP server and can also be deployed to Firebase Functions in the same Firebase project.

## Database

This project uses **Cloud Firestore** for ranking scores.

Firestore is the simplest reliable choice for this challenge because it is already part of the Firebase project used by the backend, works with the local Firebase emulator, has managed production persistence, and supports the ranking reads needed here with simple ordered queries.

Scores are stored in the `scores` collection. Each document id is the normalized player name, so player names are unique in the ranking. Submitting a score for an existing player only updates the document when the new score is higher than the stored score.

Stored score shape:

```ts
{
  playerName: string;
  score: number;
  improvements: {
    '5S': number;
    Kanban: number;
    'Poka-Yoke': number;
    TPM: number;
    Andon: number;
    Heijunka: number;
  };
  elapsedSeconds: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Score Validation

DTO validation is enabled globally with Nest's `ValidationPipe`.

`POST /scores` rejects invalid payloads and also checks score plausibility because the client is treated as untrusted. The current rule is intentionally generous:

```txt
max plausible score = elapsedSeconds * 100 + 1000
```

That allows normal play with room for timer drift, but rejects obvious cheating such as `999999` points after `5` seconds with HTTP `422`.

## Environment

Create a local `.env` file:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
USE_FIREBASE_EMULATOR=true
CORS_ORIGINS=http://localhost:5173
```

For deployed Firebase Functions, Google normally provides the project environment automatically. You can still set `FIREBASE_PROJECT_ID` explicitly if preferred.

If service-account credentials are needed outside Firebase, use:

```env
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Do not commit `.env` files or private keys.

## API

### Save score

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

### Top ranking

```http
GET /scores/top?limit=10
```

### Player rank

```http
GET /scores/me?playerName=Hector
```

## Scripts

```bash
yarn install
yarn start:dev
yarn firebase:emulators
yarn build
yarn test
```

Deploy Functions:

```bash
yarn deploy:functions
```
