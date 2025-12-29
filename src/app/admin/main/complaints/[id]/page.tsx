"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComplaint() {
      const res = await fetch(`/api/admin/complaints/${id}`);
      const data = await res.json();

      setComplaint(data.complaint);
      setStatus(data.complaint.status);
      setLoading(false);
    }

    fetchComplaint();
  }, [id]);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);

    await fetch(`/api/admin/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  if (loading) return <p className="p-10">Loading...</p>;
  if (!complaint) return <p className="p-10">Not found</p>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Card className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
          <p className="text-sm text-slate-500">
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>

        <p>{complaint.description}</p>

        <div className="flex gap-4">
          <Badge>{complaint.category}</Badge>
          <Badge variant="outline">{complaint.priority}</Badge>
        </div>

        <div className="max-w-xs">
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <Select value={status} onValueChange={updateStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In progress">In progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </main>
  );
}
