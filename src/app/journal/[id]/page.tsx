"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * JournalDetailPage displays full details of a single journal entry,
 * including title, content, creation date, and clickable categories and tags.
 */
export default function JournalDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchEntry = useCallback(async () => {
    try {
      const res = await fetch(`/api/journal/${id}`);
      const data = await res.json();
      setEntry(data);
    } catch (err: any) {
      setError("Failed to fetch journal entry.");
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchEntry();
    }
  }, [session, status, router, fetchEntry]);

  if (!entry) return <Loader />;
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
          <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>
          <p className="text-sm text-gray-600 mb-4">
            {new Date(entry.created_at).toLocaleString()}
          </p>
          <div className="mb-6">{entry.content}</div>
          <div className="flex flex-wrap gap-4 mb-4">
            {entry.entryCategories.map((ec: any) => (
              <Link key={ec.category_id} href={`/categories/${ec.category_id}/journals`}>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {ec.category.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {entry.entryTags.map((et: any) => (
              <Link key={et.tag_id} href={`/tags/${et.tag_id}/journals`}>
                <span className="text-sm text-green-600 hover:underline cursor-pointer">
                  {et.tag.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
