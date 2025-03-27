"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * CategoryListPage displays all categories for the logged-in user.
 * It includes a form to create a new category and links to edit each category.
 */
export default function CategoryListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchCategories();
    }
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?user_id=${session?.user.id}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user.id, name: newName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category.");
      }
      setNewName("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
            <div className="p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Categories</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleCreate} className="mb-6 flex gap-2">
                    <input
                    type="text"
                    placeholder="New Category Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="border p-2 rounded flex-grow"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add
                    </button>
                </form>
                {categories.length === 0 ? (
                    <p>No categories available.</p>
                ) : (
                    <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat.id} className="flex justify-between items-center border p-2 rounded">
                        <span>{cat.name}</span>
                        <Link href={`/categories/${cat.id}/edit`}>
                            <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Edit</button>
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
