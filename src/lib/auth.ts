import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "public_repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the GitHub access token on first sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.githubUsername = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose access token and username to the client-safe session
      session.accessToken = token.accessToken as string;
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
    accessToken: string;
    githubUsername: string;
  }
}
