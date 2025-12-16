
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

/* =======================
   Types
======================= */

interface SofaHeroImage {
  url: string;
  text: string;
}

/* =======================
   Component
======================= */

export default function ManageSofaHeroImages() {
  /* =====================
     STATE (ALWAYS FIRST)
  ===================== */

  const [images, setImages] = useState<SofaHeroImage[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     SAFE DERIVED STATE
  ===================== */

  const safeImages = images ?? [];

  /* =====================
     FETCH
  ===================== */

  const fetchImages = async () => {
    const { data, error } = await supabase()
      .from("frontpage")
      .select("sofa_hero_images")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("❌ Fetch error:", error);
      return;
    }

    const raw = data?.sofa_hero_images ?? [];

    // Normalize ONCE
    const normalized: SofaHeroImage[] = raw
      .map((item: any) => {
        if (typeof item === "string" && item.startsWith("http")) {
          return { url: item, text: "" };
        }
        if (typeof item === "string" && item.startsWith("{")) {
          try {
            const parsed = JSON.parse(item);
            return { url: parsed.url, text: parsed.text || "" };
          } catch {
            return null;
          }
        }
        if (typeof item === "object" && item?.url) {
          return { url: item.url, text: item.text || "" };
        }
        return null;
      })
      .filter(Boolean);

    setImages(normalized);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* =====================
     UPLOAD HELPER
  ===================== */

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase().storage.from("images").upload(fileName, file);
    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase().storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  /* =====================
     ADD IMAGE
  ===================== */

  const addImage = async () => {
    if (!newImage) return alert("Please select an image");

    setLoading(true);

    const url = await uploadImage(newImage);
    if (!url) {
      setLoading(false);
      return;
    }

    const updated = [...safeImages, { url, text: newText || "" }];

    const { error } = await supabase()
      .from("frontpage")
      .update({ sofa_hero_images: updated })
      .eq("id", 1);

    if (!error) {
      setImages(updated);
      setNewImage(null);
      setNewText("");
    }

    setLoading(false);
  };

  /* =====================
     DELETE
  ===================== */

  const deleteImage = async (index: number) => {
    if (!confirm("Delete this image?")) return;

    const updated = safeImages.filter((_, i) => i !== index);

    const { error } = await supabase()
      .from("frontpage")
      .update({ sofa_hero_images: updated })
      .eq("id", 1);

    if (!error) setImages(updated);
  };

  /* =====================
     MOVE
  ===================== */

  const moveImage = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= safeImages.length) return;

    const reordered = [...safeImages];
    [reordered[index], reordered[newIndex]] = [
      reordered[newIndex],
      reordered[index],
    ];

    const { error } = await supabase()
      .from("frontpage")
      .update({ sofa_hero_images: reordered })
      .eq("id", 1);

    if (!error) setImages(reordered);
  };

  /* =====================
     UI
  ===================== */

  return (
    <div className="mt-20 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold underline underline-offset-8">
            🛋️ Sofa Hero Slider Images
          </h2>
          <p className="text-gray-600 mt-1">
            Manage hero images for sofa sleeper pages
          </p>
        </div>

        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          {safeImages.length} Images
        </span>
      </div>

      {/* ADD IMAGE */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-bold">➕ Add New Sofa Hero Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          className="w-full border p-3 rounded"
        />

        {newImage && (
          <img
            src={URL.createObjectURL(newImage)}
            className="h-48 rounded border"
          />
        )}

        <input
          type="text"
          placeholder="Optional overlay text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <button
          onClick={addImage}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold"
        >
          {loading ? "Uploading..." : "🚀 Add Image"}
        </button>
      </div>

      {/* CURRENT IMAGES */}
      <div>
        <h3 className="text-xl font-bold mb-4">Current Sofa Hero Images</h3>

        {safeImages.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded">
            No sofa hero images yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeImages.map((img, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow overflow-hidden border hover:border-blue-400 transition"
              >
                <div className="relative h-56">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                    #{index + 1}
                  </span>

                  {img.text && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-xs text-center max-w-[90%] truncate">
                      {img.text}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="bg-gray-100 rounded py-2 text-sm disabled:opacity-40"
                    >
                      ↑ Up
                    </button>
                    <button
                      onClick={() => moveImage(index, "down")}
                      disabled={index === safeImages.length - 1}
                      className="bg-gray-100 rounded py-2 text-sm disabled:opacity-40"
                    >
                      ↓ Down
                    </button>
                  </div>

                  <button
                    onClick={() => deleteImage(index)}
                    className="w-full bg-red-50 text-red-600 rounded py-2 text-sm font-semibold"
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
  );
}