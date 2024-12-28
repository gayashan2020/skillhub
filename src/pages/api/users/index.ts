import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    try {
        const users = await prisma.user.findMany({
            skip,
            take: Number(limit),
            include: { roles: { include: { role: true } } },
        });

        const totalUsers = await prisma.user.count();
        res.status(200).json({ users, total: totalUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
