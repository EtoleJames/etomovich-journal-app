"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

/**
 * EditEntryPage allows a logged-in user to edit an existing journal entry,
 * including updating its associated categories and tags.
 */
export default function EditEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Entry ID from URL
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryIds: [] as string[],
    tagIds: [] as string[],
  });
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Enforce session: redirect if not logged in.
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    }
  }, [session, status, router]);

  // Fetch entry and available categories/tags.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the journal entry.
        const resEntry = await fetch(`/api/journal/${id}`);
        if (!resEntry.ok) {
          const data = await resEntry.json();
          throw new Error(data.error || "Failed to fetch entry.");
        }
        const entry = await resEntry.json();
        setFormData({
          title: entry.title,
          content: entry.content,
          categoryIds: entry.entryCategories.map((ec: any) => ec.category_id),
          tagIds: entry.entryTags.map((et: any) => et.tag_id),
        });

        // Fetch all categories for the user.
        const resCat = await fetch(`/api/categories?user_id=${session?.user.id}`);
        const categoriesData = await resCat.json();
        setAllCategories(categoriesData);

        // Fetch all tags for the user.
        const resTag = await fetch(`/api/tags?user_id=${session?.user.id}`);
        const tagsData = await resTag.json();
        setAllTags(tagsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && session) {
      fetchData();
    }
  }, [id, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter(id => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update entry.");
      }
      router.push("/journal");
    } catch (err: any) {
      setError(err.message);
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
        <div className="p-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Journal Entry</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Entry Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="content"
              placeholder="Write your entry here..."
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            />

            {/* Categories selection */}
            <div>
              <h2 className="font-semibold mb-2">Select Categories</h2>
              {allCategories.length === 0 ? (
                <p>No categories available.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.map(cat => (
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
              {allTags.length === 0 ? (
                <p>No tags available.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {allTags.map(tag => (
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
              className="w-full py-2 px-4 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Update Entry
            </button>
          </form>
        </div>
      </div>
    </section>
    
  );
}
