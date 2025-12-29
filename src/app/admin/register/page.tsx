"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  secretKey: z.string().min(1, "Admin secret key is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      secretKey: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
        const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        });

        if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
        }

        router.push("/admin/login");

    } catch (err: any) {
      setError("Invalid secret key or registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="border border-slate-200 rounded-xl shadow-sm bg-white/90 p-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">
          Admin Registration
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Secret Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admin secret key" {...field} />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-500">
                    For testing, kindly use the SECRET KEY given in the README of the GitHub repo.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register as Admin"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/admin/login" className="underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
