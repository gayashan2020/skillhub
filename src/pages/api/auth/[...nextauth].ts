import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Validate credentials
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    // Return user data
                    return { id: user.id, name: user.name, email: user.email };
                } catch (error) {
                    console.error("Authorize error:", error);
                    throw new Error("Unable to log in. Please try again.");
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login", // Custom login page
    },
    callbacks: {
        async jwt({ token, user }) {
            // Attach user data to token
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach token data to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
});
