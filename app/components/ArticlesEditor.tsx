"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Product Categories
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
}

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string
  image_url?: string;
}

export default function ArticlesEditor() {

  const [activeTab, setActiveTab] = useState<"products" | "blog">("blog");
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productFeatured, setProductFeatured] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  
  // Blog State
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");

//   const [articleCategory, setArticleCategory] = useState("");
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  
  // Shared State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

    // Fetch Products
    const fetchProducts = async () => {
    console.log("🛋️ Starting fetchProducts...");
    
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    console.log("Supabase fetchProducts response:", { data, error });

    if (error) {
        console.error("❌ Fetch products error:", error);
    } else {
        console.log("✅ Products data:", data);
        console.log("Number of products:", data?.length);
        setProducts(data as Product[]);
    }
    };

    const fetchArticles = async () => {
        const { data, error } = await supabase
            .from("blog")
            .select("*")
            .order("created_at", { ascending: false });

        // Safe logging
        console.log("Supabase fetchArticles response:", { data, error });

        if (error) {
            console.log("Supabase fetchArticles error:", error.message);
        } else if (!data) {
            console.warn("No articles returned from Supabase");
            setArticles([]);
        } else {
            setArticles(data as Article[]);
        }
    };

  

  useEffect(() => {
    fetchProducts();
    fetchArticles();
  }, []);

  const uploadImage = async (bucket: string): Promise<string | null> => {
  if (!imageFile) return null;

  const fileName = `${Date.now()}_${imageFile.name}`; // ensure no spaces
    const safeFileName = fileName.replace(/\s/g, "_"); // replace spaces with underscores

    // Upload to bucket root
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(safeFileName, imageFile);

    if (uploadError) {
        console.error(uploadError);
        alert(`Failed to upload image: ${uploadError.message}`);
        return null;
    }

      if (uploadError) {
            console.error("❌ Upload error:", uploadError);
            return null;
        }


    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(safeFileName);

    return data.publicUrl;
    };

  // Save Product
//   const saveProduct = async () => {
//     if (!productName.trim() || !productPrice.trim() || !productCategory) {
//       alert("Please fill in product name, price, and category");
//       return;
//     }

//     setLoading(true);
//     let imageUrl = await uploadImage("images");

//     if (editingProductId) {
//       const { error } = await supabase
//         .from("products")
//         .update({
//           name: productName,
//           description: productDescription,
//           price: productPrice,
//           category: productCategory,
//           featured: productFeatured,
//           image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
//         })
//         .eq("id", editingProductId);
//       if (error) console.error(error);
//     } else {
//       const { error } = await supabase
//         .from("products")
//         .insert([{
//           name: productName,
//           description: productDescription,
//           price: productPrice,
//           category: productCategory,
//           featured: productFeatured,
//           image_url: imageUrl || null,
//         }]);
//       if (error) console.log(error);
//     }

//     resetProductForm();
//     setLoading(false);
//     fetchProducts();
//   };


    const saveProduct = async () => {
    if (!productName.trim() || !productCategory) {
        alert("Please fill in product name and category");
        return;
    }

    console.log("💾 Starting product save...", {
        productName,
        productPrice,
        productCategory,
        productDescription,
        productFeatured,
        hasImage: !!imageFile
    });

    setLoading(true);
    let imageUrl = await uploadImage("images");

    if (editingProductId) {
        console.log("✏️ Updating product ID:", editingProductId);
        const { data, error } = await supabase
        .from("products")
        .update({
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory,
            featured: productFeatured,
            image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
        })
        .eq("id", editingProductId)
        .select(); // Add .select() to see what was updated
        
        console.log("✅ Update result:", { data, error });
        
        if (error) {
        console.error("❌ Update error:", error);
        alert(`Error updating product: ${error.message}`);
        setLoading(false);
        return; // Stop execution if error
        }
    } else {
        console.log("➕ Inserting new product...");
        const { data, error } = await supabase
        .from("products")
        .insert([{
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory,
            featured: productFeatured,
            image_url: imageUrl || null,
        }])
        .select(); // Add .select() to see what was inserted
        
        if (error) {
        console.error("❌ Insert error:", error);
        alert(`Error saving product: ${error.message}`);
        setLoading(false);
        return; // Stop execution if error
        }
        
       
    }

    resetProductForm();
    setLoading(false);
    await fetchProducts(); // Add await to make sure it completes
    console.log("🔄 Products list refreshed");
    };

  // Save Article
  const saveArticle = async () => {
    if (!articleTitle.trim() || !articleContent.trim() ) {
      alert("Please fill in title, content, and category");
      return;
    }

    setLoading(true);
    let imageUrl = await uploadImage("images");


    if (editingArticleId) {
      const { error } = await supabase
        .from("blog")
        .update({
          title: articleTitle,
          content: articleContent,
          image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
        })
        .eq("id", editingArticleId);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
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

  // Delete Functions
  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error(error);
    fetchProducts();
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await supabase.from("blog").delete().eq("id", id);
    if (error) console.error(error);
    fetchArticles();
  };

  // Edit Functions
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    // setArticleCategory(article.category);
    // setCreatedAt(article.createdat ? article.createdat.split("T")[0] : "");
    setCurrentImageUrl(article.image_url || null);
    setImageFile(null);
    setRemoveImage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset Forms
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
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArticleTitle("");
    setArticleContent("");
    // setArticleCategory("");
    // setCreatedAt("");
    setImageFile(null);
    setCurrentImageUrl(null);
    setRemoveImage(false);
  };

  // Image Component
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
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mr. Futon Furniture</h1>
        <p className="text-gray-600">Manage your products and blog content</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "products"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          🛋️ Products
        </button>
        <button
          onClick={() => setActiveTab("blog")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "blog"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          📝 Blog
        </button>
      </div>

      

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Panel */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === "products" ? (
              // PRODUCTS EDITOR
              <>
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
              </>
            ) : (
              // BLOG EDITOR
              <>
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

                  {/* <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Published Date
                    </label>
                    <input
                        type="date"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}  // ✅ Correct setter
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                  </div> */}

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
              </>
            )}
          </div>
        </div>

        {/* List Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2">
              <h3 className="text-xl font-bold text-gray-800">
                {activeTab === "products" ? "🛋️ Products" : "📚 Articles"}
              </h3>
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                {activeTab === "products" ? products.length : articles.length}
              </span>
            </div>




            {activeTab === "products" ? (
              // PRODUCTS LIST
              <div className="space-y-3 overflow-y-auto flex-1">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛋️</div>
                    <p className="text-gray-400 font-medium">No products yet</p>
                  </div>
                ) : (
                  products.map((product) => (
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
            ) : (
              // ARTICLES LIST
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}