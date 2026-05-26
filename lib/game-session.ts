import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const HUNT_SESSION_COOKIE = "hunt_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 days

export type HuntSession = {
  email: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.GAME_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("GAME_SESSION_SECRET is not configured");
  }
  return secret;
}

function signPayload(payloadB64: string): string {
  return createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailsMatch(a: string, b: string): boolean {
  return normalizeEmail(a) === normalizeEmail(b);
}

export function createSessionToken(email: string): string {
  const session: HuntSession = {
    email: normalizeEmail(email),
    exp: Date.now() + SESSION_MAX_AGE_SEC * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

export function verifySessionToken(token: string): HuntSession | null {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;

    const expected = signPayload(payloadB64);
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as HuntSession;

    if (!session.email || typeof session.exp !== "number") return null;
    if (Date.now() > session.exp) return null;

    return { email: normalizeEmail(session.email), exp: session.exp };
  } catch {
    return null;
  }
}

function cookieBaseAttributes(): string[] {
  const attrs = ["Path=/", "HttpOnly", "SameSite=Lax"];
  if (process.env.NODE_ENV === "production") {
    attrs.push("Secure");
  }
  return attrs;
}

export function buildSessionCookie(token: string): string {
  return [`${HUNT_SESSION_COOKIE}=${token}`, ...cookieBaseAttributes(), `Max-Age=${SESSION_MAX_AGE_SEC}`].join(
    "; "
  );
}

export function buildClearSessionCookie(): string {
  return [`${HUNT_SESSION_COOKIE}=`, ...cookieBaseAttributes(), "Max-Age=0"].join("; ");
}

export function getSessionFromRequest(request: Request): HuntSession | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const escaped = HUNT_SESSION_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  if (!match?.[1]) return null;

  return verifySessionToken(decodeURIComponent(match[1].trim()));
}

export function withSessionCookie(
  response: NextResponse,
  email: string
): NextResponse {
  response.headers.append("Set-Cookie", buildSessionCookie(createSessionToken(email)));
  return response;
}

export function withClearSessionCookie(response: NextResponse): NextResponse {
  response.headers.append("Set-Cookie", buildClearSessionCookie());
  return response;
}

export function sessionUnauthorized(
  message = "Not authenticated"
): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function sessionForbidden(
  message = "Session does not match this account"
): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}
