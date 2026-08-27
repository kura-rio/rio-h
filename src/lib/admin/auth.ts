import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "rio_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

function getSecret(): string | null {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && value.length > 0 ? value : null;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export function isAdminConfigured(): boolean {
  return Boolean(getPassword() && getSecret());
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = getSecret();
  if (!secret) {
    return false;
  }

  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload, secret);
  if (!safeEqual(signature, expected)) {
    return false;
  }

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return true;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function createAdminSession(): Promise<void> {
  const password = getPassword();
  const secret = getSecret();
  if (!password || !secret) {
    throw new Error("管理画面が未設定です");
  }

  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  const token = `${payload}.${sign(payload, secret)}`;

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function verifyPassword(input: string): boolean {
  const password = getPassword();
  if (!password) {
    return false;
  }
  return safeEqual(input, password);
}
