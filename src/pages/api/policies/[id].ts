import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid policy ID" });
    }

    if (req.method === "GET") {
        // Retrieve a specific policy
        try {
            const policy = await prisma.policy.findUnique({ where: { id } });
            if (!policy) {
                return res.status(404).json({ error: "Policy not found" });
            }
            return res.status(200).json(policy);
        } catch (error) {
            console.error("Error fetching policy:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    if (req.method === "DELETE") {
        // Delete a specific policy
        try {
            await prisma.policy.delete({ where: { id } });
            return res.status(204).end(); // No content
        } catch (error) {
            console.error("Error deleting policy:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
