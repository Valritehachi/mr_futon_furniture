import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

interface ManageBlogProps {
  articles: Article[];
  fetchArticles: () => Promise<void>;
}

export default function ManageBlog({ articles, fetchArticles }: ManageBlogProps) {
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const uploadImage = async (bucket: string): Promise<string | null> => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}_${imageFile.name}`;
    const safeFileName = fileName.replace(/\s/g, "_");

    const { error: uploadError } = await supabase().storage
      .from(bucket)
      .upload(safeFileName, imageFile);

    if (uploadError) {
      console.error(uploadError);
      alert(`Failed to upload image: ${uploadError.message}`);
      return null;
    }

    const { data } = supabase().storage.from(bucket).getPublicUrl(safeFileName);
    return data.publicUrl;
  };

  const saveArticle = async () => {
    if (!articleTitle.trim() || !articleContent.trim()) {
      alert("Please fill in title and content");
      return;
    }

    setLoading(true);
    let imageUrl = await uploadImage("images");

    if (editingArticleId) {
      const { error } = await supabase()
        .from("blog")
        .update({
          title: articleTitle,
          content: articleContent,
          image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
        })
        .eq("id", editingArticleId);
      if (error) console.error(error);
    } else {
      const { error } = await supabase()
        .from("blog")
        .insert([{
          title: articleTitle,
          content: articleContent,
          image_url: imageUrl || null,
        }]);

      console.log("Supabase insert response:", { error });
    }

    resetArticleForm();
    setLoading(false);
    fetchArticles();
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await supabase().from("blog").delete().eq("id", id);
    if (error) console.error(error);
    fetchArticles();
  };

  const editArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setCurrentImageUrl(article.image_url || null);
    setImageFile(null);
    setRemoveImage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArticleTitle("");
    setArticleContent("");
    setImageFile(null);
    setCurrentImageUrl(null);
    setRemoveImage(false);
  };

  const ImageUploader = () => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        🖼️ Image (Optional)
      </label>

      {currentImageUrl && !removeImage && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={currentImageUrl}
            alt="Current"
            className="w-24 h-24 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => {
              setRemoveImage(true);
              setCurrentImageUrl(null);
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      )}

      {(!currentImageUrl || removeImage) && (
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
                setRemoveImage(false);
              }
            }}
            className="w-full text-gray-700 border-2 border-gray-200 rounded-xl px-4 py-2"
          />
          {imageFile && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Editor Panel */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {editingArticleId ? "✏️ Edit Article" : "➕ Create New Article"}
            </h2>
            {editingArticleId && (
              <button
                onClick={resetArticleForm}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Article Title
              </label>
              <input
                type="text"
                placeholder="Enter article title..."
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <ImageUploader />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Content
              </label>
              <ReactQuill
                value={articleContent}
                onChange={setArticleContent}
                modules={modules}
                className="bg-white"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={saveArticle}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? "⏳ Saving..." : editingArticleId ? "💾 Update Article" : "🚀 Publish Article"}
              </button>
              {editingArticleId && (
                <button
                  onClick={resetArticleForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles List Panel */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-lg p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2">
            <h3 className="text-xl font-bold text-gray-800">📚 Articles</h3>
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {articles.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400 font-medium">No articles yet</p>
              </div>
            ) : (
              articles.map((article) => (
                <div
                  key={article.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    editingArticleId === article.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <h4
                    onClick={() => editArticle(article)}
                    className="font-bold text-sm text-gray-800 mb-2 cursor-pointer hover:text-blue-600 line-clamp-2"
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
                  
                  {article.created_at && (
                    <p className="text-xs text-gray-400 mb-3">
                      📅 {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => editArticle(article)}
                      className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="flex-1 px-3 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
);
}