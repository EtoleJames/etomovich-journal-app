"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

/**
 * JournalListPage fetches and displays all journal entries.
 * If the user is not authenticated, it redirects to the sign-in page.
 */
export default function JournalListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to sign in if not authenticated.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Fetch journal entries from API
  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      const data = await res.json();
      setEntries(data);
    } catch (err: any) {
      setError("Failed to fetch journal entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchEntries();
    }
  }, [session]);

  // Handle soft deletion of an entry
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" });
      fetchEntries();
    } catch (err) {
      alert("Failed to delete entry.");
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
      <div className="p-4 min-h-[165px] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Journal Entries</h1>
        <Link href="/journal/new">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            New Entry
          </button>
        </Link>
      </div>
      {entries.length === 0 ? (
        <p>No entries found. Create your first journal entry!</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{entry.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link href={`/journal/${entry.id}/edit`}>
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
      </div>
    </section>
    
  );
}
