/** Wire format for encrypted progress POST/PUT bodies. */
export type EncryptedProgressEnvelope = {
  _encrypted: true;
  v: 1;
  iv: string;
  enc: string;
};

export type ProgressApiBody = {
  emailId: string;
  gameProgress: string;
};

const ENVELOPE_VERSION = 1 as const;

function getClientSecret(): string | null {
  const key = process.env.NEXT_PUBLIC_PROGRESS_PAYLOAD_SECRET?.trim();
  return key || null;
}

function getServerSecret(): string | null {
  const key =
    process.env.PROGRESS_PAYLOAD_SECRET?.trim() ||
    process.env.NEXT_PUBLIC_PROGRESS_PAYLOAD_SECRET?.trim();
  return key || null;
}

function toBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importAesKey(secret: string): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secret)
  );
  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export function isEncryptedProgressEnvelope(
  body: unknown
): body is EncryptedProgressEnvelope {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return (
    o._encrypted === true &&
    o.v === ENVELOPE_VERSION &&
    typeof o.iv === "string" &&
    typeof o.enc === "string"
  );
}

export function isProgressApiBody(body: unknown): body is ProgressApiBody {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return typeof o.emailId === "string" && typeof o.gameProgress === "string";
}

export function isProgressEncryptionEnabled(): boolean {
  return Boolean(getClientSecret() || getServerSecret());
}

/** Client: encrypt progress before POST/PUT to /api/game/progress */
export async function encryptProgressPayload(
  payload: ProgressApiBody
): Promise<EncryptedProgressEnvelope> {
  const secret = getClientSecret();
  if (!secret) {
    throw new Error(
      "NEXT_PUBLIC_PROGRESS_PAYLOAD_SECRET is not set — restart the dev server after updating .env"
    );
  }
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is not available in this browser");
  }

  const key = await importAesKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plain
  );

  return {
    _encrypted: true,
    v: ENVELOPE_VERSION,
    iv: toBase64(iv),
    enc: toBase64(new Uint8Array(cipher)),
  };
}

/** Server: decrypt incoming progress body before forwarding to Phillips API */
export async function decryptProgressPayload(
  body: unknown
): Promise<ProgressApiBody> {
  const secret = getServerSecret();

  if (isProgressApiBody(body)) {
    if (secret) {
      throw new Error("Plain progress payloads are not accepted");
    }
    return body;
  }

  if (!isEncryptedProgressEnvelope(body)) {
    throw new Error("Invalid progress payload");
  }

  if (!secret) {
    throw new Error("Progress decryption is not configured on the server");
  }

  const key = await importAesKey(secret);
  const iv = fromBase64(body.iv);
  const cipher = fromBase64(body.enc);

  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );

  const parsed = JSON.parse(new TextDecoder().decode(plain)) as unknown;
  if (!isProgressApiBody(parsed)) {
    throw new Error("Decrypted progress payload is invalid");
  }

  return parsed;
}
