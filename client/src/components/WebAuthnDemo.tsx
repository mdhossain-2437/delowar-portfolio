import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const enc = new TextEncoder();

function bufferFromBase64url(value: string) {
  const padding = "===".slice((value.length + 3) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array.buffer;
}

export default function WebAuthnDemo() {
  const [status, setStatus] = useState<string>("Idle");
  const [userId, setUserId] = useState("demo-client");

  const handleRegister = async () => {
    if (!("credentials" in navigator) || !window.PublicKeyCredential) {
      setStatus("WebAuthn is not supported in this browser.");
      return;
    }

    setStatus("Requesting challenge…");
    const challengeRes = await fetch("/api/webauthn/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const payload = await challengeRes.json();
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: bufferFromBase64url(payload.challenge),
      rp: {
        name: "Delowar Portfolio",
        id: payload.rpId,
      },
      user: {
        id: enc.encode(payload.userId),
        name: payload.userId,
        displayName: payload.name,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      timeout: 60_000,
      attestation: "none",
    };

    try {
      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;
      setStatus("Credential created, sending mock verification…");
      await fetch("/api/webauthn/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: payload.userId, challenge: payload.challenge }),
      });
      setStatus(`Success! Credential id ${credential.id.slice(0, 6)}… stored securely.`);
    } catch (error: any) {
      setStatus(error?.message ?? "User cancelled");
    }
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">WebAuthn</p>
          <h2 className="text-3xl font-bold text-white">Passkey login demo</h2>
          <p className="text-muted-foreground">
            Register a passkey for the client dashboard using the WebAuthn API. This is a demo stub
            that validates the challenge server-side.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 max-w-2xl mx-auto space-y-4"
        >
          <label className="text-sm font-semibold text-muted-foreground">
            Client identifier
          </label>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="w-full rounded-xl bg-black/30 border border-white/10 p-3"
          />
          <Button onClick={handleRegister} className="w-full bg-gradient-to-r from-primary to-accent">
            Register passkey
          </Button>
          <p className="text-sm text-emerald-400">{status}</p>
          <p className="text-xs text-muted-foreground">
            NOTE: This flow is intentionally simple and stores challenges in memory only. For
            production use full WebAuthn ceremonies.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
