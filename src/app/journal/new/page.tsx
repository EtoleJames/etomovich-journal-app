"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * NewEntryPage allows a logged-in user to create a new journal entry.
 * It fetches available categories and tags and displays multi-select options.
 */
export default function NewEntryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    user_id: "",
    title: "",
    content: "",
    categoryIds: [] as string[],
    tagIds: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  // Ensure user is authenticated.
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    } else {
      setFormData(prev => ({ ...prev, user_id: session.user.id }));
      fetchCategories();
      fetchTags();
    }
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?user_id=${session?.user.id}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags?user_id=${session?.user.id}`);
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Failed to fetch tags");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(cid => cid !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const toggleTag = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(id)
        ? prev.tagIds.filter(tid => tid !== id)
        : [...prev.tagIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create entry.");
      }
      router.push("/journal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Journal Entry</h1>
          {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Entry Title"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="content"
              placeholder="Write your entry here..."
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            />

            {/* Categories selection */}
            <div>
              <h2 className="font-semibold mb-2">Select Categories</h2>
              {categories.length === 0 ? (
                <p>No categories available. Create one first.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tags selection */}
            <div>
              <h2 className="font-semibold mb-2">Select Tags</h2>
                {tags.length === 0 ? (
                  <p>No tags available. Create one first.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={tag.id}
                          checked={formData.tagIds.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                        />
                        <span>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                {loading ? "Creating..." : "Create Entry"}
              </button>
            </form>
          </div>
      </div>
    </section>
    
  );
}
