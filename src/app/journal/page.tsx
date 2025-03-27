"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

/**
 * JournalListPage displays all journal entries.
 * Each entry shows title, creation date, and clickable categories and tags.
 */
export default function JournalListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchEntries();
    }
  }, [session, status, router]);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError("Failed to fetch journal entries.");
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
        <div className="p-4 max-w-4xl mx-auto">
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
                <li key={entry.id} className="p-4 border rounded shadow-sm">
                  <Link href={`/journal/${entry.id}`}>
                    <h2 className="font-semibold text-xl hover:text-blue-500 cursor-pointer">{entry.title}</h2>
                  </Link>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.entryCategories.map((ec: any) => (
                      <Link key={ec.category_id} href={`/categories/${ec.category_id}/journals`}>
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">{ec.category.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.entryTags.map((et: any) => (
                      <Link key={et.tag_id} href={`/tags/${et.tag_id}/journals`}>
                        <span className="text-sm text-green-600 hover:underline cursor-pointer">{et.tag.name}</span>
                      </Link>
                    ))}
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
