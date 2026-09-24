import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    return NextResponse.json({ error: "Configuration admin manquante" }, { status: 500 });
  }

  if (!email || !password || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
