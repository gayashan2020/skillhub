import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method === "GET") {
        // Get a single Base entity
        try {
            const base = await prisma.base.findUnique({ where: { id: parseInt(id) } });
            if (!base) {
                return res.status(404).json({ error: "Entity not found" });
            }
            return res.status(200).json(base);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to fetch entity" });
        }
    }

    if (req.method === "PUT") {
        // Update a Base entity
        const { title, content } = req.body;
        try {
            const updatedBase = await prisma.base.update({
                where: { id: parseInt(id) },
                data: { title, content },
            });
            return res.status(200).json(updatedBase);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to update entity" });
        }
    }

    if (req.method === "DELETE") {
        // Delete a Base entity
        try {
            await prisma.base.delete({ where: { id: parseInt(id) } });
            return res.status(204).end();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to delete entity" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
