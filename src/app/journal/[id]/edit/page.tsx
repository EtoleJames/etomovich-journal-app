"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * EditEntryPage allows updating an existing journal entry.
 * It fetches the current entry data and ensures the user is authenticated.
 */
export default function EditEntryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Fetch entry data on mount.
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/journal/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch entry.");
        }
        const entry = await res.json();
        setFormData({ title: entry.title, content: entry.content });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEntry();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update entry.");
      }
      router.push("/journal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 min-h-[165px] flex items-center justify-center">
          <p className="p-4 text-red-500">{error}</p>
        </div>
      </div>
    </section>
  );

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Journal Entry</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Entry Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="content"
              placeholder="Write your entry here..."
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
            Update Entry
          </button>
        </form>
        </div>
      </div>
    </section>
    
  );
}
