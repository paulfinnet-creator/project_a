import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma/bcrypt here, so this can be imported by
// middleware.ts, which runs on the Edge runtime. The Credentials provider's
// `authorize` (which needs Prisma) is added separately in src/auth.ts, which
// only runs in the Node.js runtime (API route, server components, actions).
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && role === "ADMIN";
      }
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/booking")) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "TOURIST";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
