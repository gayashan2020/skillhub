import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid attribute ID" });
    }

    if (req.method === "DELETE") {
        try {
            await prisma.attribute.delete({
                where: { id },
            });
            res.status(204).end(); // No content
        } catch (error) {
            console.error("Error deleting attribute:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
