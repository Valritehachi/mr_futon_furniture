"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
}

export default function ArticlesEditor() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch articles
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setArticles(data as Article[]);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Add or update article
  const saveArticle = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setLoading(true);

    let imageUrl: string | undefined = undefined;

    // Upload image if selected
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("article_images") // correct bucket name
        .upload(`public/${fileName}`, imageFile);

      if (uploadError) {
        console.error(uploadError);
        alert(`Failed to upload image: ${uploadError.message}`);
      } else {
        const { data } = supabase.storage
          .from("article_images")
          .getPublicUrl(`public/${fileName}`);
        imageUrl = data.publicUrl; // store the public URL
      }
    }

    if (editingId) {
      const { error } = await supabase
        .from("articles")
        .update({ title, content, ...(imageUrl && { image_url: imageUrl }) })
        .eq("id", editingId);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from("articles")
        .insert([{ title, content, ...(imageUrl && { image_url: imageUrl }) }]);
      if (error) console.error(error);
    }

    setTitle("");
    setContent("");
    setImageFile(null);
    setEditingId(null);
    setLoading(false);
    fetchArticles();
  };

  // Delete article
  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) console.error(error);
    fetchArticles();
  };

  // Edit article
  const editArticle = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageFile(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Left Column - Main Editor */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {editingId ? (
                  <>
                    <span className="text-blue-600">✏️</span> Edit Article
                  </>
                ) : (
                  <>
                    <span className="text-green-600">➕</span> Create New Article
                  </>
                )}
              </h2>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none"
                  title="Cancel"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📝 Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🖼️ Article Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-gray-700 border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📄 Content
                </label>
                <textarea
                  placeholder="Write your article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-base leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={saveArticle}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                >
                  {loading
                    ? "⏳ Saving..."
                    : editingId
                    ? "💾 Update Article"
                    : "🚀 Publish Article"}
                </button>

                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Articles List */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📚 Articles
              </h3>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                {articles.length}
              </span>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400 font-medium">No articles yet</p>
                <p className="text-gray-400 text-sm mt-1">Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                      editingId === article.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <h4
                      onClick={() => editArticle(article)}
                      className="font-bold text-sm text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </h4>

                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="mb-2 w-full h-28 object-cover rounded-lg"
                      />
                    )}

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {article.content}
                    </p>

                    {article.created_at && (
                      <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                        📅{" "}
                        {new Date(article.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => editArticle(article)}
                        className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="flex-1 px-3 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
