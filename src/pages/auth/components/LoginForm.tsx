"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(), // Only required for signup
});

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  // Initialize React Hook Form with Zod validation
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // Form submission handler for Login or Signup
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    if (isSignup) {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
          if (Array.isArray(result.error)) {
            throw new Error(result.error.join(", "));
          } else {
            throw new Error(result.error || "Sign up failed");
          }
        }

        // Automatically log the user in after successful signup
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/dashboard");
      } catch (err) {
        form.setError("email", {
          type: "manual",
          message: (err as Error).message,
        });
      }
    } else {
      // Login logic
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (!result || result.error) {
          throw new Error("Invalid email or password");
        }

        router.push("/dashboard");
      } catch (err) {
        form.setError("email", {
          type: "manual",
          message: (err as Error).message,
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isSignup ? "Sign Up" : "Login"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isSignup && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>
      </Form>

      <p
        className="text-center text-sm cursor-pointer text-gray-600"
        onClick={() => {
          setIsSignup(!isSignup);
          form.reset(); // Reset form state when toggling between Login and Signup
        }}
      >
        {isSignup
          ? "Already have an account? Login here."
          : "Don't have an account? Sign up here."}
      </p>
    </div>
  );
}
