"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * CategoryEditPage allows the user to update or delete an existing category.
 */
export default function CategoryEditPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      fetchCategory();
    }
  }, [session, status, router, id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories?user_id=${session?.user.id}`);
      const data = await res.json();
      // Find the category matching the ID.
      const category = data.find((cat: any) => cat.id === id);
      if (!category) throw new Error("Category not found");
      setName(category.name);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update category.");
      }
      router.push("/categories");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category.");
      }
      router.push("/categories");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
            <div className="p-4 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-4">
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Update
                    </button>
                    <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                    </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
    
  );
}
