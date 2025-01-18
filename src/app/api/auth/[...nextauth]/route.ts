import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password')
          }

          const { data: user, error } = await supabaseAdmin
            .from('amo_user_login')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            throw new Error('No user found with this email')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            throw new Error('Invalid password')
          }

          if (!user.is_verified) {
            throw new Error('Please verify your email first')
          }

          return {
            id: user.user_id,
            email: user.email,
            name: user.username,
            role: user.user_role
          }
        } catch (error: any) {
          throw new Error(error.message)
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }