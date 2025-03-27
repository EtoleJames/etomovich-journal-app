"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * TagEditPage allows a user to update or delete an existing tag.
 */
export default function TagEditPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Wrap fetchTag in useCallback to ensure a stable reference.
  const fetchTag = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags?user_id=${session?.user.id}`);
      const data = await res.json();
      // Find the tag matching the ID.
      const tag = data.find((t: any) => t.id === id);
      if (!tag) throw new Error("Tag not found");
      setName(tag.name);
    } catch (err: any) {
      setError(err.message);
    }
  }, [session?.user.id, id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchTag();
    }
  }, [session, status, router, fetchTag]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update tag.");
      }
      router.push("/tags");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete tag.");
      }
      router.push("/tags");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Tag</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tag Name"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
