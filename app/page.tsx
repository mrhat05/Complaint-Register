import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight">
            Complaint System
          </h1>

          <nav className="flex gap-4">
            <Link href="/admin/login">
              <Button variant="outline" className="cursor-pointer">Admin Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-3xl text-5xl font-bold tracking-tight">
          A simple way to submit, track, and manage complaints
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          This platform allows users to raise complaints easily while giving
          administrators a structured interface to review, update, and resolve
          them efficiently.
        </p>

        <div className="mt-10 flex gap-4">
          <div>
            <Link href="/complaint/register">
              <Button size="lg" className="cursor-pointer">Register a Complaint</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h3 className="text-3xl font-semibold">Core Features</h3>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-lg font-medium">Easy Complaint Submission</h4>
              <p className="mt-2 text-sm text-slate-600">
                Users can submit complaints with clear categorization and
                priority selection through a simple form.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium">Admin Management Dashboard</h4>
              <p className="mt-2 text-sm text-slate-600">
                Administrators can view all complaints, update statuses, and
                remove resolved or invalid entries.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium">Status Notifications</h4>
              <p className="mt-2 text-sm text-slate-600">
                Email notifications keep administrators informed when new
                complaints are submitted or updated.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h3 className="text-3xl font-semibold">How It Works</h3>

        <ol className="mt-10 space-y-6 text-slate-700">
          <li>
            <span className="font-medium">1.</span> Users submit a complaint with
            relevant details and priority.
          </li>
          <li>
            <span className="font-medium">2.</span> The complaint is stored
            securely and marked as pending.
          </li>
          <li>
            <span className="font-medium">3.</span> Administrators review and
            update the complaint status as it progresses.
          </li>
          <li>
            <span className="font-medium">4.</span> Notifications are sent on new
            submissions and status changes.
          </li>
        </ol>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} Complaint Management System
        </div>
      </footer>
    </main>
  );
}
