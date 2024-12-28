import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });

    // Check if token exists and has an ID
    if (!token || typeof token.id !== "string") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Fetch user with roles       
        const user = await prisma.user.findUnique({
            where: { id: token.id },
            include: {
                roles: {
                    include: {
                        role: true, // Fetch associated role details
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
