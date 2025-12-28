"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";

const complaintSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.string().nonempty("Please select a category"),
  priority: z.enum(["Low", "Medium", "High"]),
});


type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function ComplaintRegisterPage() {
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "Low",
    },
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function onSubmit(values: ComplaintFormValues) {
  setIsSubmitting(true);
  setError(null);

  try {
    const res = await fetch("/api/complaints", {
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

    setShowAlertDialog(true);
    form.reset();
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
}


  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="border border-slate-200 rounded-xl shadow-sm bg-white/90 p-8">
        <h1 className="mb-10 text-4xl font-bold tracking-tight">
          Register a Complaint
        </h1>

        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Complaint Submitted Successfully</AlertDialogTitle>
                <AlertDialogDescription>
                    Thank you for reaching out. Your complaint has been shared with the administrator and will be addressed at the earliest possible time.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction> Go to Home</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complaint Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter complaint title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your issue in detail"
                    className="min-h-48"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-6"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {["Low", "Medium", "High"].map((level) => (
                      <FormItem
                        key={level}
                        className="flex items-center gap-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={level} className="cursor-pointer" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {level}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Complaint'
            )}
          </Button>
        </form>
        </Form>
      </div>
    </main>
  );
}
