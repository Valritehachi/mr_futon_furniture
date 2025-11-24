import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface AdvertImages {
  sofa_sleepers: string;
  mattresses: string;
  covers: string;
  space_savers: string;
  showroom: string;
  accessories: string;
}

interface ManageAdvertsProps {
  advertImages: AdvertImages;
  setAdvertImages: (images: AdvertImages) => void;
}

const ADVERT_CATEGORIES = [
  { key: "sofa_sleepers", label: "Sofa Sleepers", description: "Shop our Sofa Sleepers" },
  { key: "mattresses", label: "Futon Mattresses", description: "Shop our Futon Mattresses" },
  { key: "covers", label: "Futon Covers", description: "Shop our Futon Covers" },
  { key: "space_savers", label: "Space Savers", description: "Shop our Space Savers" },
  { key: "showroom", label: "Visit Showroom", description: "Visit our Showroom" },
  { key: "accessories", label: "Accessories", description: "Shop our Accessories" },
];

export default function ManageAdverts({ advertImages, setAdvertImages }: ManageAdvertsProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [replaceImage, setReplaceImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvertImages = async () => {
    const { data, error } = await supabase
      .from("frontpage")
      .select("advert_images")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching advert images:", error);
      return;
    }

    if (data && data.advert_images) {
      setAdvertImages(data.advert_images);
    }
  };

  const handleReplaceImage = async (categoryKey: string) => {
    if (!replaceImage) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    try {
      // Upload to Supabase storage
      const fileName = `${Date.now()}_${replaceImage.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, replaceImage);

      if (uploadError) {
        alert("Error uploading: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Get public URL
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);

      // Fetch current advert images from database
      const { data: currentData } = await supabase
        .from("frontpage")
        .select("advert_images")
        .eq("id", 1)
        .single();

      const updatedAdverts = {
        ...(currentData?.advert_images || {}),
        [categoryKey]: data.publicUrl,
      };

      // Save to database
      const { error } = await supabase
        .from("frontpage")
        .update({ advert_images: updatedAdverts })
        .eq("id", 1);

      if (!error) {
        alert("Image updated successfully!");
        setReplaceImage(null);
        setEditingCategory(null);
        await fetchAdvertImages();
      } else {
        alert("Error saving: " + error.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Unexpected error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8 mt-30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 underline underline-offset-8 mb-6">
            📺 Advert Images Management
          </h2>
          <p className="text-gray-600 mt-1">Manage the 6 category images on homepage</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ADVERT_CATEGORIES.map((category) => (
          <div
            key={category.key}
            className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
          >
            {/* Image Preview */}
            <div className="relative h-64 bg-gray-100">
              <img
                src={advertImages[category.key as keyof AdvertImages]}
                alt={category.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.description}</h3>
                <p className="text-sm">{category.label}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-5 space-y-4">
              {editingCategory === category.key ? (
                // Edit Mode
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Replace {category.label} Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReplaceImage(e.target.files?.[0] || null)}
                      className="w-full text-sm px-3 py-2 border-2 border-gray-300 rounded-lg"
                    />
                    {replaceImage && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(replaceImage)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border mb-2"
                        />
                        <button
                          onClick={() => handleReplaceImage(category.key)}
                          disabled={loading}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? "⏳ Uploading..." : "✓ Confirm Replace"}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setReplaceImage(null);
                    }}
                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // View Mode
                <button
                  onClick={() => setEditingCategory(category.key)}
                  className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all"
                >
                  ✏️ Replace Image
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}