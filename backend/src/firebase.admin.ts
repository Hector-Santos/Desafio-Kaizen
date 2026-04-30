import 'dotenv/config';
import {
  cert,
  getApps,
  initializeApp,
  type AppOptions,
} from 'firebase-admin/app';

const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.GCLOUD_PROJECT ??
  process.env.GOOGLE_CLOUD_PROJECT;

function getFirebaseAppOptions(): AppOptions | undefined {
  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (projectId && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      credential: cert({
        projectId,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      projectId,
    };
  }

  return projectId ? { projectId } : undefined;
}

export const firebaseApp =
  getApps()[0] ?? initializeApp(getFirebaseAppOptions());

if (
  process.env.USE_FIREBASE_EMULATOR === 'true' &&
  !process.env.FIRESTORE_EMULATOR_HOST
) {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:4004';
}
