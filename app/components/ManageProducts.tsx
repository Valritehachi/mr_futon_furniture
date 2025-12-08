import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useEffect } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });



const productCategories = [
  "Futon Sets",
  "Mattresses",
  "Covers",
  "Accessories",
  "Space Savers",
  "Sofa Sleepers",
];

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url?: string;
  created_at?: string;
  featured?: boolean;
  mattress_options?: Array<{ 
    size: string; 
    price: string;
    image_url?: string;
  }>;
}

interface ManageProductsProps {
  products: Product[];
  fetchProducts: () => Promise<void>;
}





export default function ManageProducts({ products, fetchProducts }: ManageProductsProps) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productFeatured, setProductFeatured] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  interface MattressOption {
    label: string;
    price: string;
    image: string | File | null;
  }


  const defaultMattressOptions: MattressOption[] = [
    {
      label: "6 Inch Single Foam",
      price: "",
      image: "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/mff_6-inch-single-foam-featuredimage.jpg",
    },
    {
      label: "8 Inch Double Foam",
      price: "",
      image: "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/mff_8-inch-double-foam-featuredimage.jpg",
    },
    {
      label: "9 Inch Triple Foam",
      price: "",
      image: "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/mff_9-inch-triple-foam-featuredimage.jpg",
    },
    {
      label: "10 Inch Double Foam",
      price: "",
      image: "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/mff_10-inch-double-foam.png",
    },
  ];


  useEffect(() => {
    if (productCategory === "Futon Sets" && mattresses.length === 0) {
      setMattresses(defaultMattressOptions);
      setVisibleMattresses(defaultMattressOptions.map(() => true));
      setMattressImageFiles(defaultMattressOptions.map(() => null));
    }
  }, [productCategory]);
  

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductFeatured(false);
    setImageFile(null);
    setCurrentImageUrl(null);
    setRemoveImage(false);
    setMattresses([]);
    setVisibleMattresses([]);
    setMattressImageFiles([]);
  };

  const [mattresses, setMattresses] = useState<MattressOption[]>([]);
  const [visibleMattresses, setVisibleMattresses] = useState<boolean[]>([]);
  const [mattressImageFiles, setMattressImageFiles] = useState<(File | null)[]>([]);

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

  const uploadMattressImage = async (file: File, index: number): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase().storage
      .from("images")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      alert(`Failed to upload mattress image: ${error.message}`);
      return null;
    }

    const { data } = supabase().storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveProduct = async () => {
    if (!productName.trim() || !productCategory) {
      alert("Please fill in product name and category");
      return;
    }

    if (productCategory === "Futon Sets") {
      const allPricesFilled = mattresses.every((m, idx) => visibleMattresses[idx] ? m.price : true);
      if (!allPricesFilled) {
        alert("Please fill in all mattress prices for Futon Sets");
        return;
      }
    }

    

    setLoading(true);
    let imageUrl = await uploadImage("images");

    let mattressOptions = null;

    if (productCategory === "Futon Sets") {
      mattressOptions = [];

      for (let i = 0; i < mattresses.length; i++) {
        if (!visibleMattresses[i]) continue;

        const m = mattresses[i];
        let imgUrl = null;

        // Upload if file selected
        if (m.image instanceof File) {
          const fileName = `${Date.now()}_${m.image.name.replace(/\s/g, "_")}`;

          const { error: uploadError } = await supabase().storage
            .from("images")
            .upload(fileName, m.image);

          if (!uploadError) {
            const { data } = supabase().storage
              .from("images")
              .getPublicUrl(fileName);

            imgUrl = data.publicUrl;
          }
        }

        mattressOptions.push({
          size: m.label,
          price: m.price,
          image_url: imgUrl || (typeof m.image === "string" ? m.image : null),
        });
      }
    }

    if (editingProductId) {
      const { data, error } = await supabase()
        .from("products")
        .update({
          name: productName,
          description: productDescription,
          price: productPrice,
          category: productCategory,
          featured: productFeatured,
          mattress_options: mattressOptions,
          image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
        })
        .eq("id", editingProductId)
        .select();
        
      if (error) {
        console.error("❌ Update error:", error);
        alert(`Error updating product: ${error.message}`);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase()
        .from("products")
        .insert([{
          name: productName,
          description: productDescription,
          price: productPrice,
          category: productCategory,
          featured: productFeatured,
          mattress_options: mattressOptions,
          image_url: imageUrl || null,
        }])
        .select();
        
      if (error) {
        console.error("❌ Insert error:", error);
        alert(`Error saving product: ${error.message}`);
        setLoading(false);
        return;
      }
    }

    resetProductForm();
    setLoading(false);
    await fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase().from("products").delete().eq("id", id);
    if (error) console.error(error);
    fetchProducts();
  };

  const editProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductCategory(product.category);
    setProductFeatured(product.featured || false);
    setCurrentImageUrl(product.image_url || null);
    setImageFile(null);
    setRemoveImage(false);

    if (product.mattress_options && Array.isArray(product.mattress_options)) {
      setMattresses(product.mattress_options.map(opt => ({
        label: opt.size,
        price: opt.price,
        image: opt.image_url || "",
      })));
      setVisibleMattresses(product.mattress_options.map(() => true));
      setMattressImageFiles(product.mattress_options.map(() => null));

    } else {
      setMattresses([]);
      setVisibleMattresses([]);
    }

  }

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
              {editingProductId ? "✏️ Edit Product" : "➕ Add New Product"}
            </h2>
            {editingProductId && (
              <button
                onClick={resetProductForm}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g., Premium Futon Set"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Price
              </label>
              <input
                type="text"
                placeholder="e.g., $299 or From $199"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <ReactQuill
                value={productDescription}
                onChange={setProductDescription}
                modules={modules}
                className="bg-white rounded-xl"
              />
            </div>
            

            {productCategory === "Futon Sets" && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🛏️ Mattress Pricing Options
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter prices and images for each mattress size.
                </p>

                <div className="space-y-6">
                  {mattresses.map((mattress, idx) => (
                    visibleMattresses[idx] && (
                      <div key={idx} className="border-b pb-4 last:border-b-0 relative">

                        {/* X BUTTON */}
                        <button
                          onClick={() => {
                            const updated = [...visibleMattresses];
                            updated[idx] = false;
                            setVisibleMattresses(updated);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>

                        <h4 className="font-semibold text-gray-700 mb-3">{mattress.label}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                            <input
                              type="text"
                              placeholder="e.g., $459.00"
                              value={mattress.price}
                              onChange={(e) => {
                                const updated = [...mattresses];
                                updated[idx].price = e.target.value;
                                setMattresses(updated);
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>

                            {/* Existing image */}
                            {typeof mattress.image === "string" && mattress.image !== "" && (
                              <img
                                src={mattress.image}
                                alt={mattress.label}
                                className="w-full h-48 object-cover rounded-lg border mb-2"
                              />
                            )}

                            {/* Image picker */}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const updated = [...mattresses];
                                  updated[idx].image = file; // store file
                                  setMattresses(updated);
                                }
                              }}
                              className="w-full border p-2 rounded"
                            />

                            {/* Preview new image */}
                            {mattress.image instanceof File && (
                              <img
                                src={URL.createObjectURL(mattress.image)}
                                className="w-full h-48 object-cover mt-3 rounded-lg border"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={productFeatured}
                onChange={(e) => setProductFeatured(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="featured" className="text-sm font-bold text-gray-700">
                ⭐ Featured Product (show on homepage)
              </label>
            </div>

            <ImageUploader />

            <div className="flex gap-3 pt-3">
              <button
                onClick={saveProduct}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? "⏳ Saving..." : editingProductId ? "💾 Update Product" : "🚀 Add Product"}
              </button>
              {editingProductId && (
                <button
                  onClick={resetProductForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products List Panel */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-lg p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2">
            <h3 className="text-xl font-bold text-gray-800">🛋️ Products</h3>
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {products.length}
            </span>
          </div>
          
          <div className="relative mt-5">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchQuery("")} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-lg"
            title="Clear search"
          >
            🔍
          </button>
        </div>

          <div className="space-y-3 overflow-y-auto mt-5 flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛋️</div>
                <p className="text-gray-400 font-medium">No products yet</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    editingProductId === product.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {product.featured && (
                    <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold mb-2">
                      ⭐ Featured
                    </span>
                  )}
                  <h4
                    onClick={() => editProduct(product)}
                    className="font-bold text-sm text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                  >
                    {product.name}
                  </h4>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="mb-2 w-full h-28 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-blue-600 font-bold text-sm mb-2">{product.price}</p>
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 mb-3">
                    {product.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editProduct(product)}
                      className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
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
  