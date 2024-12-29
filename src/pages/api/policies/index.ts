import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod schema for policy validation
const policySchema = z.object({
    name: z.string().min(3, "Policy name must be at least 3 characters long."),
    description: z.string().optional(),
    conditions: z.record(z.any()),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // Create a new policy
        try {
            const validatedData = policySchema.parse(req.body);

            const newPolicy = await prisma.policy.create({
                data: validatedData,
            });

            return res.status(201).json(newPolicy);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors.map((e) => e.message) });
            }
            console.error("Error creating policy:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    if (req.method === "GET") {
        // Retrieve all policies
        try {
            const policies = await prisma.policy.findMany();
            return res.status(200).json(policies);
        } catch (error) {
            console.error("Error fetching policies:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
