import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connector } from '@/commons/database';
import UserEntity from '@/entities/user.entity';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connector();

        const user = await UserEntity.findOne({
          email: credentials?.email,
        });

        if (!user) throw new Error('Invalid Credentials.');

        const hashed = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );

        if (!hashed) throw new Error('Invalid Credentials.');

        // Return user data, including id
        return {
          id: user._id.toString(),
          name: user.name || '',
          email: user.email || '',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log(user, 'jwt callback');
      // Ensure that the user data is properly added to the token
      if (user) {
        token.user = {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log(token.user, 'session callback');
      // Attach the user data from token to session
      session.user = token.user; // This should now have the correct type
      return session;
    },
  },
};
