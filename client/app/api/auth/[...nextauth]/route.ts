import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { AuthOptions } from 'next-auth';
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const res = await axios.post(`http://localhost:5000/api/auth/google`, {
            email: profile.email,
            name: profile.name,
            image: profile.image,
          });
          token.backendAccessToken = res.data.accessToken;
          token.user = {
            email: profile.email,
            name: profile.name,
            image: profile.image
          };
        } catch (err) {
          console.error('Backend token fetch error:', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.backendAccessToken = token.backendAccessToken as string;
      session.user = {
        email: token.user?.email ?? null,
        name: token.user?.name ?? null,
        image: token.user?.image ?? null,
      };
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };