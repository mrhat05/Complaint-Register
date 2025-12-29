"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";

interface Complaint {
  _id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/complaints?page=${page}&limit=10`
        );
        const data = await res.json();
        setComplaints(data.data || []);
      } catch (error) {
        console.error("Failed to fetch complaints");
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [page]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* COMPLAINTS TABLE */}
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Complaints
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading complaints...
          </p>
        ) : complaints.length === 0 ? (
          <p className="text-sm text-slate-500">
            No complaints found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {complaints.map((complaint) => (
                <TableRow
                    key={complaint._id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() =>
                      router.push(`/admin/main/complaints/${complaint._id}`)
                    }
                  >
                  <TableCell className="font-medium">
                    {complaint.title}
                  </TableCell>

                  <TableCell>{complaint.category}</TableCell>

                  <TableCell>
                    <PriorityBadge priority={complaint.priority} />
                  </TableCell>

                  <TableCell>{complaint.status}</TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {/* Debug log for createdAt */}
                    {/* Remove after debugging if not needed */}
                    {(() => {
                      if (!complaint.createdAt) return "N/A";
                      const date = new Date(complaint.createdAt);
                      if (isNaN(date.getTime())) {
                        console.log("Invalid createdAt:", complaint.createdAt);
                        return "N/A";
                      }
                      return date.toLocaleDateString();
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* PAGINATION */}
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>
    </main>
  );
}

/* -------------------------------
   Priority Badge
-------------------------------- */
function PriorityBadge({
  priority,
}: {
  priority: Complaint["priority"];
}) {
  if (priority === "High") {
    return <Badge variant="destructive">High</Badge>;
  }

  if (priority === "Medium") {
    return (
      <Badge className="bg-amber-100 text-amber-800">
        Medium
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-100 text-green-800">
      Low
    </Badge>
  );
}
