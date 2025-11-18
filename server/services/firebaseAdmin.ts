import admin from "firebase-admin";
import { appConfig } from "../config";

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;
  if (
    !appConfig.firebase.projectId ||
    !appConfig.firebase.clientEmail ||
    !appConfig.firebase.privateKey
  ) {
    console.warn("Firebase admin credentials missing. Skipping init.");
    return null;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: appConfig.firebase.projectId,
      clientEmail: appConfig.firebase.clientEmail,
      privateKey: appConfig.firebase.privateKey,
    }),
  });

  return firebaseApp;
}

export async function verifyFirebaseToken(token: string) {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error("Firebase admin is not configured");
  }
  return app.auth().verifyIdToken(token);
}
