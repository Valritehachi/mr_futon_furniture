
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManageAdverts from "./ManageAdverts";

interface ManageFrontPageProps {
  heroImages: string[];
  setHeroImages: (images: string[]) => void;
}

export default function ManageFrontPage({ heroImages, setHeroImages }: ManageFrontPageProps) {
  const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
  const [editingHeroIndex, setEditingHeroIndex] = useState<number | null>(null);
  const [replaceHeroImage, setReplaceHeroImage] = useState<File | null>(null);

  const [advertImages, setAdvertImages] = useState({
    sofa_sleepers: "",
    mattresses: "",
    covers: "",
    space_savers: "",
    showroom: "",
    accessories: "",
  });

  // Fetch hero images from database (like fetchArticles in ManageBlog)
  const fetchHeroImages = async () => {
    const { data, error } = await supabase
      .from("frontpage")
      .select("hero_images, advert_images")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching frontpage data:", error);
      return;
    }

    if (data?.hero_images) setHeroImages(data.hero_images);
    if (data?.advert_images) setAdvertImages(data.advert_images);
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
            {heroImages.length} {heroImages.length === 1 ? 'Image' : 'Images'}
          </span>
        </div>
      </div>

      {/* Add New Image Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Hero Image</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewHeroImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {newHeroImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(newHeroImage)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              if (!newHeroImage) {
                alert("Please select an image");
                return;
              }

              console.log("🚀 Starting upload...");

              // Upload to Supabase storage
              const fileName = `${Date.now()}_${newHeroImage.name.replace(/\s/g, "_")}`;
              const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(fileName, newHeroImage);

              if (uploadError) {
                console.error("Upload error:", uploadError);
                alert("Error uploading image: " + uploadError.message);
                return;
              }

              // Get public URL
              const { data } = supabase.storage.from("images").getPublicUrl(fileName);
              console.log("Image URL:", data.publicUrl);

              // Fetch current images from database first
              const { data: currentData } = await supabase
                .from("frontpage")
                .select("hero_images")
                .eq("id", 1)
                .single();

              const currentImages = currentData?.hero_images || [];
              const updatedImages = [...currentImages, data.publicUrl];

              console.log("Updating with:", updatedImages);

              // Save to frontpage table
              const { error } = await supabase
                .from("frontpage")
                .update({ hero_images: updatedImages })
                .eq("id", 1);

              if (!error) {
                console.log("✅ Save successful");
                alert("Hero image added successfully!");
                setNewHeroImage(null);
                // Fetch fresh data from database (like ManageBlog does)
                await fetchHeroImages();
              } else {
                console.error("Save error:", error);
                alert("Error saving image: " + error.message);
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
          >
            🚀 Add Hero Image
          </button>
        </div>
      </div>

      {/* Current Images Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Hero Images</h3>
        
        {heroImages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-500 font-medium">No hero images yet</p>
            <p className="text-gray-400 text-sm">Add your first image above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {heroImages.map((imageUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
              >
                {/* Image Preview */}
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Hero image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Order Badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    #{index + 1}
                  </div>
                </div>

                {/* Image Controls */}
                <div className="p-5 space-y-4">
                  {editingHeroIndex === index ? (
                    // Edit Mode - Replace Image
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Replace Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setReplaceHeroImage(e.target.files?.[0] || null)}
                          className="w-full text-sm px-3 py-2 border-2 border-gray-300 rounded-lg"
                        />
                        {replaceHeroImage && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(replaceHeroImage)}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border mb-2"
                            />
                            <button
                              onClick={async () => {
                                const fileName = `${Date.now()}_${replaceHeroImage.name.replace(/\s/g, "_")}`;
                                const { error: uploadError } = await supabase.storage
                                  .from("images")
                                  .upload(fileName, replaceHeroImage);

                                if (uploadError) {
                                  alert("Error uploading: " + uploadError.message);
                                  return;
                                }

                                const { data } = supabase.storage.from("images").getPublicUrl(fileName);
                                
                                // Fetch current from database first
                                const { data: currentData } = await supabase
                                  .from("frontpage")
                                  .select("hero_images")
                                  .eq("id", 1)
                                  .single();

                                const updated = [...(currentData?.hero_images || [])];
                                updated[index] = data.publicUrl;
                                
                                const { error } = await supabase
                                  .from("frontpage")
                                  .update({ hero_images: updated })
                                  .eq("id", 1);

                                if (!error) {
                                  setReplaceHeroImage(null);
                                  setEditingHeroIndex(null);
                                  alert("Image replaced successfully!");
                                  // Refresh from database
                                  await fetchHeroImages();
                                } else {
                                  alert("Error saving: " + error.message);
                                }
                              }}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                            >
                              ✓ Confirm Replace
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setEditingHeroIndex(null);
                          setReplaceHeroImage(null);
                        }}
                        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3">
                      {/* Action Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setEditingHeroIndex(index)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("Are you sure you want to delete this image?")) return;
                            
                            // Fetch current from database first
                            const { data: currentData } = await supabase
                              .from("frontpage")
                              .select("hero_images")
                              .eq("id", 1)
                              .single();

                            const updated = (currentData?.hero_images || []).filter((_: string, i: number) => i !== index);
                            
                            const { error } = await supabase
                              .from("frontpage")
                              .update({ hero_images: updated })
                              .eq("id", 1);

                            if (!error) {
                              alert("Image deleted successfully!");
                              // Refresh from database
                              await fetchHeroImages();
                            } else {
                              alert("Error deleting: " + error.message);
                            }
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (index === 0) return;
                            
                            // Fetch current from database first
                            const { data: currentData } = await supabase
                              .from("frontpage")
                              .select("hero_images")
                              .eq("id", 1)
                              .single();

                            const updated = [...(currentData?.hero_images || [])];
                            [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
                            
                            const { error } = await supabase
                              .from("frontpage")
                              .update({ hero_images: updated })
                              .eq("id", 1);

                            if (!error) {
                              // Refresh from database
                              await fetchHeroImages();
                            } else {
                              alert("Error reordering: " + error.message);
                            }
                          }}
                          disabled={index === 0}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ↑ Move Up
                        </button>
                        <button
                          onClick={async () => {
                            if (index === heroImages.length - 1) return;
                            
                            // Fetch current from database first
                            const { data: currentData } = await supabase
                              .from("frontpage")
                              .select("hero_images")
                              .eq("id", 1)
                              .single();

                            const updated = [...(currentData?.hero_images || [])];
                            [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                            
                            const { error } = await supabase
                              .from("frontpage")
                              .update({ hero_images: updated })
                              .eq("id", 1);

                            if (!error) {
                              // Refresh from database
                              await fetchHeroImages();
                            } else {
                              alert("Error reordering: " + error.message);
                            }
                          }}
                          disabled={index === heroImages.length - 1}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ↓ Move Down
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-6">
        <ManageAdverts advertImages={advertImages} setAdvertImages={setAdvertImages} />
      </div>
      
    
    </div>
  

  );
}