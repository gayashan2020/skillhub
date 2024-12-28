import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define schemas
const createAttributeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { name, description } = req.body;

            // Validate request body
            const validatedData = createAttributeSchema.parse({ name, description });

            const attribute = await prisma.attribute.create({
                data: validatedData,
            });
            res.status(201).json(attribute);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message);
                return res.status(400).json({ error: errorMessages });
            }
            console.error("Error creating attribute:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else if (req.method === "GET") {
        try {
            const attributes = await prisma.attribute.findMany();
            res.status(200).json(attributes);
        } catch (error) {
            console.error("Error fetching attributes:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
