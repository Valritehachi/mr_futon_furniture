
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManageAdverts from "./ManageAdverts";

interface HeroImage {
  url: string;
  text: string;
}



export default function ManageFrontPage() {



  // Safety check - this is CRITICAL to prevent undefined errors
  

  const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);

  const [newHeroText, setNewHeroText] = useState("");
  const [editingHeroIndex, setEditingHeroIndex] = useState<number | null>(null);
  const [replaceHeroImage, setReplaceHeroImage] = useState<File | null>(null);
  const [replaceHeroText, setReplaceHeroText] = useState("");

  const [advertImages, setAdvertImages] = useState({
    sofa_sleepers: { url: "", header: "", description: "" },
    mattresses: { url: "", header: "", description: "" },
    covers: { url: "", header: "", description: "" },
    space_savers: { url: "", header: "", description: "" },
    showroom: { url: "", header: "", description: "" },
    accessories: { url: "", header: "", description: "" },
  });

  const safeHeroImages = heroImages || [];

  // --- Fetch hero images and adverts ---
  const fetchHeroImages = async () => {
    const { data, error } = await supabase()
      .from("frontpage")
      .select("hero_images, advert_images")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching frontpage data:", error);
      return;
    }

    if (data?.hero_images) {
      const formattedImages: HeroImage[] = data.hero_images.map((img: any) =>
        typeof img === "string" ? { url: img, text: "" } : img
      );
      setHeroImages(formattedImages);
    }

    if (data?.advert_images) setAdvertImages(data.advert_images);
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // --- Add New Hero Image ---
  const addHeroImage = async () => {
    if (!newHeroImage) return alert("Please select an image");

    const fileName = `${Date.now()}_${newHeroImage.name.replace(/\s/g, "_")}`;
    const { error: uploadError } = await supabase().storage.from("images").upload(fileName, newHeroImage);
    if (uploadError) return alert("Upload error: " + uploadError.message);

    const { data } = supabase().storage.from("images").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    const { data: currentData } = await supabase()
      .from("frontpage")
      .select("hero_images")
      .eq("id", 1)
      .single();

    const currentImages: HeroImage[] = (currentData?.hero_images || []).map((img: any) =>
      typeof img === "string" ? { url: img, text: "" } : img
    );

    const updatedImages = [...currentImages, { url: publicUrl, text: newHeroText || "" }];

    const { error } = await supabase().from("frontpage").update({ hero_images: updatedImages }).eq("id", 1);

    if (!error) {
      alert("Hero image added!");
      setNewHeroImage(null);
      setNewHeroText("");
      setHeroImages(updatedImages);
    } else {
      alert("Error saving image: " + error.message);
    }
  };

  // --- Save Edited Hero ---
  const saveEditedHero = async (index: number) => {
    let newUrl = safeHeroImages[index].url;

    if (replaceHeroImage) {
      const fileName = `${Date.now()}_${replaceHeroImage.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase().storage.from("images").upload(fileName, replaceHeroImage);
      if (uploadError) return alert("Upload error: " + uploadError.message);

      const { data } = supabase().storage.from("images").getPublicUrl(fileName);
      newUrl = data.publicUrl;
    }

    const updatedImages = [...safeHeroImages];
    updatedImages[index] = { url: newUrl, text: replaceHeroText || "" };

    const { error } = await supabase().from("frontpage").update({ hero_images: updatedImages }).eq("id", 1);

    if (!error) {
      alert("Hero image updated!");
      setEditingHeroIndex(null);
      setReplaceHeroImage(null);
      setReplaceHeroText("");
      setHeroImages(updatedImages);
    } else {
      alert("Error saving image: " + error.message);
    }
  };

  // --- Delete Hero Image ---
  const deleteHeroImage = async (index: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const updatedImages = safeHeroImages.filter((_, i) => i !== index);
    const { error } = await supabase().from("frontpage").update({ hero_images: updatedImages }).eq("id", 1);

    if (!error) setHeroImages(updatedImages);
    else alert("Error deleting: " + error.message);
  };

  // --- Reorder Hero Images ---
  const moveHeroImage = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= safeHeroImages.length) return;

    const updated = [...safeHeroImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    const { error } = await supabase().from("frontpage").update({ hero_images: updated }).eq("id", 1);
    if (!error) setHeroImages(updated);
    else alert("Error reordering: " + error.message);
  };

  return (
    <div className="space-y-8 mt-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 underline underline-offset-8 mb-6">🏡 Hero Slider Management</h2>
          <p className="text-gray-600 mt-1">Manage homepage hero images</p>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-sm font-semibold text-blue-800">
            {safeHeroImages.length} {safeHeroImages.length === 1 ? "Image" : "Images"}
          </span>
        </div>
      </div>

      {/* Add New Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Hero Image</h3>
        <input type="file" accept="image/*" onChange={(e) => setNewHeroImage(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
        {newHeroImage && <img src={URL.createObjectURL(newHeroImage)} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 mt-3" />}
        <div className="relative">
          <input type="text" placeholder="Optional text overlay for hero image" value={newHeroText} onChange={(e) => setNewHeroText(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
          {newHeroText && (
            <button
              onClick={() => setNewHeroText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              title="Clear text"
            >
              ✕
            </button>
          )}
        </div>
        <button onClick={addHeroImage} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800">🚀 Add Hero Image</button>
      </div>

      {/* Current Hero Images */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Hero Images</h3>
        {safeHeroImages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-500 font-medium">No hero images yet</p>
            <p className="text-gray-400 text-sm">Add your first image above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {safeHeroImages.map((image, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all">
                <div className="relative h-64 bg-gray-100">
                  <img src={image.url} alt={`Hero image ${index + 1}`} className="w-full h-full object-cover" />
                  {image.text && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm max-w-[90%] text-center truncate">{image.text}</div>}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">#{index + 1}</div>
                </div>

                <div className="p-5 space-y-4">
                  {editingHeroIndex === index ? (
                    <div className="space-y-3">
                      <input type="file" accept="image/*" onChange={(e) => setReplaceHeroImage(e.target.files?.[0] || null)}
                        className="w-full text-sm px-3 py-2 border-2 border-gray-300 rounded-lg" />
                      {replaceHeroImage && <img src={URL.createObjectURL(replaceHeroImage)} alt="Preview" className="w-full h-32 object-cover rounded-lg border mb-2" />}
                      <div className="relative">
                        <input type="text" placeholder="Optional text (leave empty for no text)" value={replaceHeroText} onChange={(e) => setReplaceHeroText(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm" />
                        {replaceHeroText && (
                          <button
                            onClick={() => setReplaceHeroText("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
                            title="Clear text"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <button onClick={() => saveEditedHero(index)} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">✓ Save Changes</button>
                      <button onClick={() => { setEditingHeroIndex(null); setReplaceHeroImage(null); setReplaceHeroText(""); }}
                        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { setEditingHeroIndex(index); setReplaceHeroText(image.text || ""); }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all">✏️ Edit</button>
                        <button onClick={() => deleteHeroImage(index)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all">🗑️ Delete</button>
                      </div>
                      {image.text && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                          <span className="font-semibold">Text:</span> {image.text}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => moveHeroImage(index, "up")} disabled={index === 0}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">↑ Up</button>
                    <button onClick={() => moveHeroImage(index, "down")} disabled={index === safeHeroImages.length - 1}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">↓ Down</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adverts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-6">
        <ManageAdverts advertImages={advertImages} setAdvertImages={setAdvertImages} />
      </div>
    </div>
  );
}
