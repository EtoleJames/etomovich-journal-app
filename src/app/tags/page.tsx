"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * TagListPage displays all tags for the logged-in user.
 * It includes a form to create a new tag and links to edit each tag.
 */
export default function TagListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tags, setTags] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  // Wrap fetchTags in useCallback to stabilize its reference.
  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags?user_id=${session?.user.id}`);
      const data = await res.json();
      setTags(data);
    } catch (err: any) {
      setError("Failed to fetch tags.");
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchTags();
    }
  }, [session, status, router, fetchTags]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user.id, name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create tag.");
      }
      setNewName("");
      fetchTags();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">My Tags</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleCreate} className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="New Tag Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="border p-2 rounded flex-grow"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add
            </button>
          </form>
          {tags.length === 0 ? (
            <p>No tags available.</p>
          ) : (
            <ul className="space-y-2">
              {tags.map((tag) => (
                <li key={tag.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{tag.name}</span>
                  <Link href={`/tags/${tag.id}/edit`}>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      Edit
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
