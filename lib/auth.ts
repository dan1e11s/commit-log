import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github" && profile) {
                const githubProfile = profile as any;
                const existingUser = await prisma.user.findUnique({
                    where: { githubId: githubProfile.id.toString() },
                });

                if (existingUser) {
                    await prisma.user.update({
                        where: { githubId: githubProfile.id.toString() },
                        data: {
                            email: githubProfile.email || user.email,
                            name: githubProfile.name || user.name,
                            avatarUrl: githubProfile.avatar_url,
                            accessToken: account.access_token,
                        },
                    });
                    user.id = existingUser.id;
                } else {
                    const newUser = await prisma.user.create({
                        data: {
                            githubId: githubProfile.id.toString(),
                            email: githubProfile.email || user.email,
                            name: githubProfile.name || user.name,
                            avatarUrl: githubProfile.avatar_url,
                            accessToken: account.access_token,
                        },
                    });
                    user.id = newUser.id;

                    await prisma.subscription.create({
                        data: {
                            userId: newUser.id,
                            tier: "FREE",
                            status: "ACTIVE",
                        },
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
    },
    session: {
        strategy: "jwt",
    },
};
