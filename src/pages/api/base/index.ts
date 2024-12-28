import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // Create a new Base entity
        const { title, content } = req.body;
        try {
            const base = await prisma.base.create({
                data: { title, content },
            });
            return res.status(201).json(base);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to create entity" });
        }
    }

    if (req.method === "GET") {
        // Get all Base entities
        try {
            const bases = await prisma.base.findMany();
            return res.status(200).json(bases);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to fetch entities" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
