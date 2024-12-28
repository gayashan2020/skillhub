import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define schemas
const idSchema = z.string().uuid("Invalid user ID");
const updateUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        // Validate `id`
        const userId = idSchema.parse(id);

        if (req.method === "PUT") {
            const { name, email } = req.body;

            // Validate request body
            const validatedData = updateUserSchema.parse({ name, email });

            try {
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: validatedData,
                });

                return res.status(200).json(updatedUser);
            } catch (error) {
                console.error("Error updating user:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({ error: errorMessages });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
