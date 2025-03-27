"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * DashboardPage displays quick links and recent journal entries.
 * It enforces session authentication and uses ShadCN‑inspired card components.
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchRecentEntries();
    }
  }, [session, status, router]);

  // Fetch recent journal entries from the backend.
  const fetchRecentEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      if (!res.ok) throw new Error("Failed to fetch journal entries.");
      const data = await res.json();
      // Sort and take 5 most recent entries
      const sorted = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentEntries(sorted.slice(0, 5));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-6 max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/journal/new">
              <div className="cursor-pointer rounded-lg dark:bg-[#3660d4] p-6 shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">New Journal Entry</h2>
                <p className="text-gray-600 dark:text-black">Create a new entry quickly.</p>
              </div>
            </Link>
            <Link href="/analytics">
              <div className="cursor-pointer rounded-lg dark:bg-[#3660d4]  p-6 shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                <p className="text-gray-600 dark:text-black">View insights and trends.</p>
              </div>
            </Link>
            <Link href="/settings">
              <div className="cursor-pointer rounded-lg dark:bg-[#3660d4] p-6 shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">Settings</h2>
                <p className="text-gray-600 dark:text-black">Manage your profile.</p>
              </div>
            </Link>
          </div>

          {/* Recent Journal Entries */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Journal Entries</h2>
            {loading ? (
              <p className="p-4">Loading entries...</p>
            ) : error ? (
              <p className="p-4 text-red-500">{error}</p>
            ) : recentEntries.length === 0 ? (
              <p className="p-4">No journal entries found. Create one now!</p>
            ) : (
              <ul className="space-y-4">
                {recentEntries.map((entry) => (
                  <li key={entry.id} className="rounded-lg p-4 shadow hover:shadow-lg transition">
                    <Link href={`/journal/${entry.id}`}>
                      <h3 className="text-xl font-semibold hover:text-blue-500 cursor-pointer">{entry.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.entryCategories.map((ec: any) => (
                        <Link key={ec.category_id} href={`/categories/${ec.category_id}/journals`}>
                          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 hover:underline cursor-pointer">
                            {ec.category.name}
                          </span>
                        </Link>
                      ))}
                      {entry.entryTags.map((et: any) => (
                        <Link key={et.tag_id} href={`/tags/${et.tag_id}/journals`}>
                          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600 hover:underline cursor-pointer">
                            {et.tag.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>
      </div>
    </section>
  );
}
