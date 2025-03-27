"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * CategoryJournalsPage displays all journal entries associated with a specific category.
 */
export default function CategoryJournalsPage() {
  const { id } = useParams(); // category ID
  const { data: session, status } = useSession();
  const router = useRouter();
  const [journals, setJournals] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchJournals();
    }
  }, [session, status, router, id]);

  const fetchJournals = async () => {
    try {
      const res = await fetch(`/api/categories/${id}/journals`);
      const data = await res.json();
      setJournals(data);
    } catch (err: any) {
      setError("Failed to fetch journals for this category.");
    }
  };

  if (!journals) return <Loader />;
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
                <h1 className="text-2xl font-bold mb-4">Journals in this Category</h1>
                {journals.length === 0 ? (
                    <p>No journals found for this category.</p>
                ) : (
                    <ul className="space-y-4">
                        {journals.map((journal) => (
                            <li key={journal.id} className="p-4 border rounded shadow-sm">
                                <Link href={`/journal/${journal.id}`}>
                                    <h2 className="font-semibold text-xl hover:text-blue-500 cursor-pointer">{journal.title}</h2>
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
