"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * TagJournalsPage displays all journal entries associated with a specific tag.
 */
export default function TagJournalsPage() {
  const { id } = useParams(); // tag ID
  const { data: session, status } = useSession();
  const router = useRouter();
  const [journals, setJournals] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Wrap fetchJournals in useCallback to ensure its reference is stable.
  const fetchJournals = useCallback(async () => {
    try {
      const res = await fetch(`/api/tags/${id}/journals`);
      const data = await res.json();
      setJournals(data);
    } catch (err: any) {
      setError("Failed to fetch journals for this tag.");
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchJournals();
    }
  }, [session, status, router, fetchJournals]);

  if (!journals.length && !error) return <Loader />;
  if (error)
    return (
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
          <h1 className="text-2xl font-bold mb-4">Journals with this Tag</h1>
          {journals.length === 0 ? (
            <p>No journals found for this tag.</p>
          ) : (
            <ul className="space-y-4">
              {journals.map((journal) => (
                <li key={journal.id} className="p-4 border rounded shadow-sm">
                  <Link href={`/journal/${journal.id}`}>
                    <h2 className="font-semibold text-xl hover:text-green-500 cursor-pointer">
                      {journal.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600">
                    {new Date(journal.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
