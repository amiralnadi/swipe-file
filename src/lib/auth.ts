import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_APP_CLIENT_ID!,
      clientSecret: process.env.GITHUB_APP_CLIENT_SECRET!,
      authorization: {
        params: {
          // Only request identity — repo access is handled via GitHub App installation
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.githubUsername = (profile as { login?: string })?.login ?? account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.githubUsername = token.githubUsername as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

// Extend the session types
declare module "next-auth" {
  interface Session {
    githubUsername: string;
  }
}
