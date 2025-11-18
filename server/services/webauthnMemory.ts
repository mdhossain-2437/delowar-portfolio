import crypto from "crypto";

const challengeStore = new Map<string, string>();

export function createChallenge(userId: string) {
  const challenge = crypto.randomBytes(32).toString("base64url");
  challengeStore.set(userId, challenge);
  return challenge;
}

export function verifyChallenge(userId: string, challenge: string) {
  const stored = challengeStore.get(userId);
  if (!stored) return false;
  const ok = stored === challenge;
  if (ok) {
    challengeStore.delete(userId);
  }
  return ok;
}
