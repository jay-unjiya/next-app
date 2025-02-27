import NextAuth from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import credentialsProvider from 'next-auth/providers/credentials'
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
const bcrypt = require('bcryptjs')

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GIT_CLIENT_ID,
            clientSecret: process.env.GIT_CLIENT_SECRET
        }),
        credentialsProvider({
            name: 'credentials',
            async authorize(credentials) {
                await connectDB()
                const user = await users.findOne({ email: credentials.email })
                if (!user) throw new Error('User not found')
                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) {
                    throw new Error('invalid password')
                }
                return { id: user._id, email: user.email, name: user.name }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id,
                    token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            return session;
        }
    },
    secret: process.env.NEXT_SECRET
})