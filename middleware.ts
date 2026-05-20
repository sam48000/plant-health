import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export const middleware = auth;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|apple-touch-icon.png|icon-192.png|icon-512.png|sw.js|manifest.webmanifest).*)",
  ],
};
