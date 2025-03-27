"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * NewEntryPage provides a form to create a new journal entry.
 * It ensures the user is authenticated and pre-fills the user_id from the session.
 */
export default function NewEntryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ user_id: "", title: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to sign in if not authenticated.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (session) {
      // Set the user_id from session data
      setFormData((prev) => ({ ...prev, user_id: session.user.id || "" }));
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create entry.");
      }
      router.push("/journal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <Loader />;

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 min-h-[165px] flex items-center justify-center">
          <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Journal Entry</h1>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Entry Title"
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="content"
                placeholder="Write your entry here..."
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                {loading ? "Creating..." : "Create Entry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    
  );
}
