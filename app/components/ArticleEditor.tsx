"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/utils/supabaseClient";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ArticleEditor(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveArticle = async () => {
    setSaving(true);
    const { error } = await supabase.from("articles").insert([{ title, content }]);
    setSaving(false);

    if (error) setMessage(`Error: ${error.message}`);
    else {
      setMessage("Article saved!");
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Create Article</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded mb-4"
      />
      <ReactQuill value={content} onChange={setContent} className="mb-4" />
      <div className="flex items-center gap-3">
        <button
          onClick={saveArticle}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save Article"}
        </button>
        {message && <span className="text-gray-700">{message}</span>}
      </div>
    </div>
  );
}
