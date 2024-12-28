import bcrypt from "bcrypt";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const validatedData = signupSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ success: true, user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({ error: errorMessages });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
