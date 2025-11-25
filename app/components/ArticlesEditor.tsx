// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/utils/supabaseClient";
// import dynamic from "next/dynamic";
// import "react-quill-new/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// // Product Categories
// const productCategories = [
//   "Futon Sets",
//   "Mattresses",
//   "Covers",
//   "Accessories",
//   "Space Savers",
//   "Sofa Sleepers",
// ];


// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   category: string;
//   image_url?: string;
//   created_at?: string;
//   featured?: boolean;
//   mattress_options?: Array<{ 
//     size: string; 
//     price: string;
//     image_url?: string;
//   }>;
// }

// interface Article {
//   id: number;
//   title: string;
//   content: string;
//   created_at: string
//   image_url?: string;
// }

// export default function ArticlesEditor() {

//   const [activeTab, setActiveTab] = useState<"products" | "blog" | "frontpage" | "settings">("blog");
  
//   // Products State
//   const [products, setProducts] = useState<Product[]>([]);
//   const [productName, setProductName] = useState("");
//   const [productDescription, setProductDescription] = useState("");
//   const [productPrice, setProductPrice] = useState("");
//   const [productCategory, setProductCategory] = useState("");
//   const [productFeatured, setProductFeatured] = useState(false);
//   const [editingProductId, setEditingProductId] = useState<number | null>(null);

//   const [mattress6Price, setMattress6Price] = useState("");
//   const [mattress8Price, setMattress8Price] = useState("");
//   const [mattress9Price, setMattress9Price] = useState("");
//   const [mattress10Price, setMattress10Price] = useState("");

//   const [mattress6Image, setMattress6Image] = useState("");
//   const [mattress8Image, setMattress8Image] = useState("");
//   const [mattress9Image, setMattress9Image] = useState("");
//   const [mattress10Image, setMattress10Image] = useState("");

//   const [HeroImages, setHeroImages] = useState<string[]>([]);
//   const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
//   const [editingHeroIndex, setEditingHeroIndex] = useState<number | null>(null);
//   const [replaceHeroImage, setReplaceHeroImage] = useState<File | null>(null);

//   // SETTINGS STATE
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [hours, setHours] = useState([""]);

  
//   // Blog State
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [articleTitle, setArticleTitle] = useState("");
//   const [articleContent, setArticleContent] = useState("");

//   //   const [articleCategory, setArticleCategory] = useState("");
//   const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  
//   // Shared State
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
//   const [removeImage, setRemoveImage] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Quill modules
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image"],
//       ["clean"],
//     ],
//   };

//     // Fetch Products
//     const fetchProducts = async () => {
//     console.log("🛋️ Starting fetchProducts...");
    
//     const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .order("created_at", { ascending: false });

//     console.log("Supabase fetchProducts response:", { data, error });

//     if (error) {
//         console.error("❌ Fetch products error:", error);
//     } else {
//         console.log("✅ Products data:", data);
//         console.log("Number of products:", data?.length);
//         setProducts(data as Product[]);
//     }
//     };

//     ßArticles = async () => {
//         const { data, error } = await supabase
//             .from("blog")
//             .select("*")
//             .order("created_at", { ascending: false });

//         // Safe logging
//         console.log("Supabase fetchArticles response:", { data, error });

//         if (error) {
//             console.log("Supabase fetchArticles error:", error.message);
//         } else if (!data) {
//             console.warn("No articles returned from Supabase");
//             setArticles([]);
//         } else {
//             setArticles(data as Article[]);
//         }
//     };

//   useEffect(() => {
//     const loadSettings = async () => {
//       const { data } = await supabase.from("settings").select("*").single();
//       if (data) {
//         setEmail(data.store_email || "");
//         setPhone(data.store_phone || "");
//         setHours(data.working_hours || [""]);
//       }
//     };
//     loadSettings();
//   }, []);

//   useEffect(() => {
//     const loadFrontPage = async () => {
//       const { data } = await supabase.from("frontpage").select("*").maybeSingle();
//       if (data?.Hero_images) {
//         setHeroImages(data.Hero_images);
//       }
//     };

//     loadFrontPage();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//     fetchArticles();
//   }, []);

//   const uploadImage = async (bucket: string): Promise<string | null> => {
//   if (!imageFile) return null;

//   const fileName = `${Date.now()}_${imageFile.name}`; // ensure no spaces
//     const safeFileName = fileName.replace(/\s/g, "_"); // replace spaces with underscores

//     // Upload to bucket root
//     const { error: uploadError } = await supabase.storage
//         .from(bucket)
//         .upload(safeFileName, imageFile);

//     if (uploadError) {
//         console.error(uploadError);
//         alert(`Failed to upload image: ${uploadError.message}`);
//         return null;
//     }

//       if (uploadError) {
//             console.error("❌ Upload error:", uploadError);
//             return null;
//         }


//     // Get public URL
//     const { data } = supabase.storage.from(bucket).getPublicUrl(safeFileName);

//     return data.publicUrl;
//     };

//     // Save Settings
//     const saveSettings = async () => {
//       const { error } = await supabase
//         .from("settings")
//         .update({
//           store_email: email,
//           store_phone: phone,
//           working_hours: hours,
//           updated_at: new Date(),
//         })
//         .eq("id", 1);

//       if (error) {
//         alert("Error saving settings");
//       } else {
//         alert("Settings updated successfully!");
//       }

//       console.log("⬅️ Raw response:", { error });
//     };




//     const saveFrontPage = async () => {
//       let uploadedUrl = null;

//       if (newHeroImage) {
//         const fileName = `${Date.now()}_${newHeroImage.name.replace(/\s/g, "_")}`;
//         const { error: uploadError } = await supabase.storage
//           .from("images")
//           .upload(fileName, newHeroImage);

//         if (!uploadError) {
//           const { data } = supabase.storage.from("images").getPublicUrl(fileName);
//           uploadedUrl = data.publicUrl;
//         }
//       }

//       const updatedImages = uploadedUrl 
//         ? [...HeroImages, uploadedUrl] 
//         : HeroImages;

//       const { error } = await supabase
//         .from("frontpage")
//         .update({ Hero_images: updatedImages })
//         .eq("id", 1);

//       if (error) alert("Error saving front page");
//       else {
//         alert("Front Page updated!");
//         setHeroImages(updatedImages);
//         setNewHeroImage(null);  
//       }
//     };

    

//     // Save Product

//     const saveProduct = async () => {
//     if (!productName.trim() || !productCategory) {
//         alert("Please fill in product name and category");
//         return;
//     }

//     if (productCategory === "Futon Sets") {
//       if (!mattress6Price || !mattress8Price || !mattress9Price || !mattress10Price) {
//         alert("Please fill in all mattress prices for Futon Sets");
//         return;
//       }
//     }

//     console.log("💾 Starting product save...", {
//         productName,
//         productPrice,
//         productCategory,
//         productDescription,
//         productFeatured,
//         hasImage: !!imageFile
//     });

//     setLoading(true);
//     let imageUrl = await uploadImage("images");

//     // Build mattress options if it's a Futon Set
//     const mattressOptions = productCategory === "Futon Sets" ? [
//       { size: "6 Inch Single Foam", price: mattress6Price, image_url: mattress6Image || null },
//       { size: "8 Inch Double Foam", price: mattress8Price, image_url: mattress8Image || null },
//       { size: "9 Inch Triple Foam", price: mattress9Price, image_url: mattress9Image || null },
//       { size: "10 Inch Double Foam", price: mattress10Price, image_url: mattress10Image || null },
//     ] : null;

//     console.log("📸 Image upload result:", imageUrl);

//     if (editingProductId) {
//         console.log("✏️ Updating product ID:", editingProductId);
//         const { data, error } = await supabase
//         .from("products")
//         .update({
//             name: productName,
//             description: productDescription,
//             price: productPrice,
//             category: productCategory,
//             featured: productFeatured,
//             mattress_options: mattressOptions,
//             image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
//         })
//         .eq("id", editingProductId)
//         .select(); // Add .select() to see what was updated
        
//         console.log("✅ Update result:", { data, error });
        
//         if (error) {
//           console.error("❌ Update error:", error);
//           alert(`Error updating product: ${error.message}`);
//           setLoading(false);
//           return; // Stop execution if error
//         }
//     } else {
//         console.log("➕ Inserting new product...");
//         const { data, error } = await supabase
//         .from("products")
//         .insert([{
//             name: productName,
//             description: productDescription,
//             price: productPrice,
//             category: productCategory,
//             featured: productFeatured,
//             mattress_options: mattressOptions,
//             image_url: imageUrl || null,
//         }])
//         .select(); // Add .select() to see what was inserted
        
//         if (error) {
//           console.error("❌ Insert error:", error);
//           alert(`Error saving product: ${error.message}`);
//           setLoading(false);
//           return; // Stop execution if error
//         }
        
       
//     }

//     resetProductForm();
//     setLoading(false);
//     await fetchProducts(); // Add await to make sure it completes
//     console.log("🔄 Products list refreshed");
//     };


//   // Save Article
//   const saveArticle = async () => {
//     if (!articleTitle.trim() || !articleContent.trim() ) {
//       alert("Please fill in title, content, and category");
//       return;
//     }

//     setLoading(true);
//     let imageUrl = await uploadImage("images");


//     if (editingArticleId) {
//       const { error } = await supabase
//         .from("blog")
//         .update({
//           title: articleTitle,
//           content: articleContent,
//           image_url: removeImage ? null : imageUrl ?? currentImageUrl ?? null,
//         })
//         .eq("id", editingArticleId);
//       if (error) console.error(error);
//     } else {
//       const { error } = await supabase
//         .from("blog")
//         .insert([{
//           title: articleTitle,
//           content: articleContent,
//           image_url: imageUrl || null,
//         }]);
     

//         console.log("Supabase insert response:", { error });
//     }

//     resetArticleForm();
//     setLoading(false);
//     fetchArticles();
//   };

//   // Delete Functions
//   const deleteProduct = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;
//     const { error } = await supabase.from("products").delete().eq("id", id);
//     if (error) console.error(error);
//     fetchProducts();
//   };

//   const deleteArticle = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this article?")) return;
//     const { error } = await supabase.from("blog").delete().eq("id", id);
//     if (error) console.error(error);
//     fetchArticles();
//   };

//   // Edit Functions
//   const editProduct = (product: Product) => {
//     setEditingProductId(product.id);
//     setProductName(product.name);
//     setProductDescription(product.description);
//     setProductPrice(product.price);
//     setProductCategory(product.category);
//     setProductFeatured(product.featured || false);
//     setCurrentImageUrl(product.image_url || null);
//     setImageFile(null);
//     setRemoveImage(false);

//     // Load mattress prices if they exist
//   if (product.mattress_options && Array.isArray(product.mattress_options)) {
//     const options = product.mattress_options;
//     setMattress6Price(options.find(o => o.size.includes("6"))?.price || "");
//     setMattress8Price(options.find(o => o.size.includes("8"))?.price || "");
//     setMattress9Price(options.find(o => o.size.includes("9"))?.price || "");
//     setMattress10Price(options.find(o => o.size.includes("10"))?.price || "");

//     setMattress6Image(options.find(o => o.size.includes("6"))?.image_url || "");
//     setMattress8Image(options.find(o => o.size.includes("8"))?.image_url || "");
//     setMattress9Image(options.find(o => o.size.includes("9"))?.image_url || "");
//     setMattress10Image(options.find(o => o.size.includes("10"))?.image_url || "");
//   } else {
//     // Clear mattress prices if no options
//     setMattress6Price("");
//     setMattress8Price("");
//     setMattress9Price("");
//     setMattress10Price("");
//     setMattress6Image("");
//     setMattress8Image("");
//     setMattress9Image("");
//     setMattress10Image("");
//   }


//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };


//   const editArticle = (article: Article) => {
//     setEditingArticleId(article.id);
//     setArticleTitle(article.title);
//     setArticleContent(article.content);
//     // setArticleCategory(article.category);
//     // setCreatedAt(article.createdat ? article.createdat.split("T")[0] : "");
//     setCurrentImageUrl(article.image_url || null);
//     setImageFile(null);
//     setRemoveImage(false);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset Forms
//   const resetProductForm = () => {
//     setEditingProductId(null);
//     setProductName("");
//     setProductDescription("");
//     setProductPrice("");
//     setProductCategory("");
//     setProductFeatured(false);
//     setImageFile(null);
//     setCurrentImageUrl(null);
//     setRemoveImage(false);

//     // Reset mattress prices
//     setMattress6Price("");
//     setMattress8Price("");
//     setMattress9Price("");
//     setMattress10Price("");

//     setMattress6Image("");
//     setMattress8Image("");
//     setMattress9Image("");
//     setMattress10Image("");
//   };




//   const resetArticleForm = () => {
//     setEditingArticleId(null);
//     setArticleTitle("");
//     setArticleContent("");
//     // setArticleCategory("");
//     // setCreatedAt("");
//     setImageFile(null);
//     setCurrentImageUrl(null);
//     setRemoveImage(false);
//   };

//   // Image Component
//   const ImageUploader = () => (
//     <div>
//       <label className="block text-sm font-bold text-gray-700 mb-2">
//         🖼️ Image (Optional)
//       </label>

//       {currentImageUrl && !removeImage && (
//         <div className="mt-2 flex items-center gap-3">
//           <img
//             src={currentImageUrl}
//             alt="Current"
//             className="w-24 h-24 object-cover rounded-lg border"
//           />
//           <button
//             type="button"
//             onClick={() => {
//               setRemoveImage(true);
//               setCurrentImageUrl(null);
//             }}
//             className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
//           >
//             Remove
//           </button>
//         </div>
//       )}

//       {(!currentImageUrl || removeImage) && (
//         <div className="mt-2">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               if (e.target.files && e.target.files[0]) {
//                 setImageFile(e.target.files[0]);
//                 setRemoveImage(false);
//               }
//             }}
//             className="w-full text-gray-700 border-2 border-gray-200 rounded-xl px-4 py-2"
//           />
//           {imageFile && (
//             <div className="mt-3 flex items-center gap-3">
//               <img
//                 src={URL.createObjectURL(imageFile)}
//                 alt="Preview"
//                 className="w-24 h-24 object-cover rounded-lg border"
//               />
//               <button
//                 type="button"
//                 onClick={() => setImageFile(null)}
//                 className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
//               >
//                 Remove
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-2">Mr. Futon Furniture</h1>
//         <p className="text-gray-600">Manage your products and blog content</p>
//       </div>

//       {/* Tabs */}
//       <div className="mb-6 flex gap-4">
//         <button
//           onClick={() => setActiveTab("products")}
//           className={`px-6 py-3 rounded-lg font-bold transition-all ${
//             activeTab === "products"
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-white text-gray-600 hover:bg-gray-50"
//           }`}
//         >
//           🛋️ Products
//         </button>
//         <button
//           onClick={() => setActiveTab("blog")}
//           className={`px-6 py-3 rounded-lg font-bold transition-all ${
//             activeTab === "blog"
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-white text-gray-600 hover:bg-gray-50"
//           }`}
//         >
//           📝 Blog
//         </button>

//         <button
//           onClick={() => setActiveTab("settings")}
//           className={`px-6 py-3 rounded-lg font-bold transition-all ${
//             activeTab === "settings"
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-white text-gray-600 hover:bg-gray-50"
//           }`}
//         >
//           ⚙️ Settings
//         </button>

//         <button
//           onClick={() => setActiveTab("frontpage")}
//           className={`px-6 py-3 rounded-lg font-bold transition-all ${
//             activeTab === "frontpage"
//               ? "bg-blue-600 text-white shadow-lg"
//               : "bg-white text-gray-600 hover:bg-gray-50"
//           }`}
//         >
//           🖼️ Front Page
//         </button>

//       </div>

      

//       {/* Content Area */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Editor Panel */}
//         <div className="flex-1">
//           <div className="bg-white rounded-xl shadow-lg p-8">
//             {activeTab === "products" ? (
//               // PRODUCTS EDITOR
//               <>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-3xl font-bold text-gray-800">
//                     {editingProductId ? "✏️ Edit Product" : "➕ Add New Product"}
//                   </h2>
//                   {editingProductId && (
//                     <button
//                       onClick={resetProductForm}
//                       className="text-gray-400 hover:text-gray-600 text-3xl"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="e.g., Premium Futon Set"
//                       value={productName}
//                       onChange={(e) => setProductName(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={productCategory}
//                       onChange={(e) => setProductCategory(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select category</option>
//                       {productCategories.map((cat) => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Price
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="e.g., $299 or From $199"
//                       value={productPrice}
//                       onChange={(e) => setProductPrice(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Description
//                      </label>
//                     <ReactQuill
//                         value={productDescription}
//                         onChange={setProductDescription}
//                         modules={modules}
//                         className="bg-white rounded-xl"
//                     />
//                   </div>


//                   {/* ADD THIS ENTIRE SECTION: */}
//                   {productCategory === "Futon Sets" && (
//                   <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
//                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                       🛏️ Mattress Pricing Options
//                     </h3>
//                     <p className="text-sm text-gray-600 mb-4">
//                       Enter prices and image URLs for each mattress size.
//                     </p>
                    
//                     <div className="space-y-6">
//                       {/* 6 Inch */}
//                       <div className="border-b pb-4">
//                         <h4 className="font-semibold text-gray-700 mb-3">6 Inch Single Foam</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="e.g., $459.00"
//                               value={mattress6Price}
//                               onChange={(e) => setMattress6Price(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Image URL
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="https://..."
//                               value={mattress6Image}
//                               onChange={(e) => setMattress6Image(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* 8 Inch */}
//                       <div className="border-b pb-4">
//                         <h4 className="font-semibold text-gray-700 mb-3">8 Inch Double Foam</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="e.g., $589.00"
//                               value={mattress8Price}
//                               onChange={(e) => setMattress8Price(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Image URL
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="https://..."
//                               value={mattress8Image}
//                               onChange={(e) => setMattress8Image(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* 9 Inch */}
//                       <div className="border-b pb-4">
//                         <h4 className="font-semibold text-gray-700 mb-3">9 Inch Triple Foam</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="e.g., $599.00"
//                               value={mattress9Price}
//                               onChange={(e) => setMattress9Price(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Image URL
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="https://..."
//                               value={mattress9Image}
//                               onChange={(e) => setMattress9Image(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* 10 Inch */}
//                       <div>
//                         <h4 className="font-semibold text-gray-700 mb-3">10 Inch Double Foam</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="e.g., $699.00"
//                               value={mattress10Price}
//                               onChange={(e) => setMattress10Price(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                               Image URL
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="https://..."
//                               value={mattress10Image}
//                               onChange={(e) => setMattress10Image(e.target.value)}
//                               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}



//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="featured"
//                       checked={productFeatured}
//                       onChange={(e) => setProductFeatured(e.target.checked)}
//                       className="w-5 h-5"
//                     />
//                     <label htmlFor="featured" className="text-sm font-bold text-gray-700">
//                       ⭐ Featured Product (show on homepage)
//                     </label>
//                   </div>

//                   <ImageUploader />

//                   <div className="flex gap-3 pt-3">
//                     <button
//                       onClick={saveProduct}
//                       disabled={loading}
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
//                     >
//                       {loading ? "⏳ Saving..." : editingProductId ? "💾 Update Product" : "🚀 Add Product"}
//                     </button>
//                     {editingProductId && (
//                       <button
//                         onClick={resetProductForm}
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </>
//             ) : activeTab === "blog" ? (
              
//               // BLOG EDITOR
//               <>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-3xl font-bold text-gray-800">
//                     {editingArticleId ? "✏️ Edit Article" : "➕ Create New Article"}
//                   </h2>
//                   {editingArticleId && (
//                     <button
//                       onClick={resetArticleForm}
//                       className="text-gray-400 hover:text-gray-600 text-3xl"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Article Title
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter article title..."
//                       value={articleTitle}
//                       onChange={(e) => setArticleTitle(e.target.value)}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     />
//                   </div>

//                   <ImageUploader />

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Content
//                     </label>
//                     <ReactQuill
//                       value={articleContent}
//                       onChange={setArticleContent}
//                       modules={modules}
//                       className="bg-white"
//                     />
//                   </div>

//                   <div className="flex gap-3 pt-3">
//                     <button
//                       onClick={saveArticle}
//                       disabled={loading}
//                       className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
//                     >
//                       {loading ? "⏳ Saving..." : editingArticleId ? "💾 Update Article" : "🚀 Publish Article"}
//                     </button>
//                     {editingArticleId && (
//                       <button
//                         onClick={resetArticleForm}
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </>
//               ) : activeTab === "settings" ? (
//               // SETTINGS PANEL
//               <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl space-y-6">
//                 <div>
//                   <label className="block font-semibold mb-1">Email</label>
//                   <input
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     placeholder="example@email.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold mb-1">Phone Number</label>
//                   <input
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     placeholder="+1 (555) 000-0000"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold mb-1">
//                     Working Hours (Up to 4)
//                   </label>

//                   {hours.map((h, i) => (
//                     <input
//                       key={i}
//                       value={h}
//                       onChange={(e) => {
//                         const newHours = [...hours];
//                         newHours[i] = e.target.value;
//                         setHours(newHours);
//                       }}
//                       className="w-full p-2 border rounded mb-2"
//                       placeholder="Example: Mon–Fri: 9am–6pm"
//                     />
//                   ))}

//                   {hours.length < 4 && (
//                     <button
//                       onClick={() => setHours([...hours, ""])}
//                       className="mt-2 text-blue-600"
//                     >
//                       + Add another
//                     </button>
//                   )}
//                 </div>

//                 <button
//                   onClick={saveSettings}
//                   className="bg-blue-600 text-white px-4 py-2 rounded shadow"
//                 >
//                   Save Settings
//                 </button>
//               </div>


//             ) : activeTab === "frontpage" && (
//               <>
//                 <div className="space-y-8">
//                   {/* Header */}
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-3xl font-bold text-gray-800">🏡 Hero Slider Management</h2>
//                       <p className="text-gray-600 mt-1">Manage homepage hero images</p>
//                     </div>
//                     <div className="bg-blue-100 px-4 py-2 rounded-lg">
//                       <span className="text-sm font-semibold text-blue-800">
//                         {HeroImages.length} {HeroImages.length === 1 ? 'Image' : 'Images'}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Add New Image Section */}
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
//                     <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Hero Image</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Upload Image
//                         </label>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => setNewHeroImage(e.target.files?.[0] || null)}
//                           className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//                         />
//                         {newHeroImage && (
//                           <div className="mt-3">
//                             <img
//                               src={URL.createObjectURL(newHeroImage)}
//                               alt="Preview"
//                               className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
//                             />
//                           </div>
//                         )}
//                       </div>

//                       <button
//                         onClick={async () => {
//                           if (!newHeroImage) {
//                             alert("Please select an image");
//                             return;
//                           }

//                           const fileName = `${Date.now()}_${newHeroImage.name.replace(/\s/g, "_")}`;
//                           const { error: uploadError } = await supabase.storage
//                             .from("images")
//                             .upload(fileName, newHeroImage);

//                           if (!uploadError) {
//                             const { data } = supabase.storage.from("images").getPublicUrl(fileName);
//                             const updatedImages = [...HeroImages, data.publicUrl];

//                             const { error } = await supabase
//                               .from("frontpage")
//                               .update({ Hero_images: updatedImages })
//                               .eq("id", 1);

//                             if (error) alert("Error adding image");
//                             else {
//                               alert("Hero image added successfully!");
//                               setHeroImages(updatedImages);
//                               setNewHeroImage(null);
//                             }
//                           } else {
//                             alert("Error uploading image: " + uploadError.message);
//                           }
//                         }}
//                         className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
//                       >
//                         🚀 Add Hero Image
//                       </button>
//                     </div>
//                   </div>

//                   {/* Current Images Grid */}
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-4">Current Hero Images</h3>
                    
//                     {HeroImages.length === 0 ? (
//                       <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
//                         <div className="text-6xl mb-4">🖼️</div>
//                         <p className="text-gray-500 font-medium">No hero images yet</p>
//                         <p className="text-gray-400 text-sm">Add your first image above</p>
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {HeroImages.map((imageUrl, index) => (
//                           <div
//                             key={index}
//                             className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
//                           >
//                             {/* Image Preview */}
//                             <div className="relative h-64 bg-gray-100">
//                               <img
//                                 src={imageUrl}
//                                 alt={`Hero image ${index + 1}`}
//                                 className="w-full h-full object-cover"
//                               />

//                               {/* Order Badge */}
//                               <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
//                                 #{index + 1}
//                               </div>
//                             </div>

//                             {/* Image Controls */}
//                             <div className="p-5 space-y-4">
//                               {editingHeroIndex === index ? (
//                                 // Edit Mode - Replace Image
//                                 <div className="space-y-3">
//                                   <div>
//                                     <label className="block text-xs font-semibold text-gray-600 mb-1">
//                                       Replace Image
//                                     </label>
//                                     <input
//                                       type="file"
//                                       accept="image/*"
//                                       onChange={(e) => setReplaceHeroImage(e.target.files?.[0] || null)}
//                                       className="w-full text-sm px-3 py-2 border-2 border-gray-300 rounded-lg"
//                                     />
//                                     {replaceHeroImage && (
//                                       <div className="mt-2">
//                                         <img
//                                           src={URL.createObjectURL(replaceHeroImage)}
//                                           alt="Preview"
//                                           className="w-full h-32 object-cover rounded-lg border mb-2"
//                                         />
//                                         <button
//                                           onClick={async () => {
//                                             const fileName = `${Date.now()}_${replaceHeroImage.name.replace(/\s/g, "_")}`;
//                                             const { error: uploadError } = await supabase.storage
//                                               .from("images")
//                                               .upload(fileName, replaceHeroImage);

//                                             if (!uploadError) {
//                                               const { data } = supabase.storage.from("images").getPublicUrl(fileName);
//                                               const updated = [...HeroImages];
//                                               updated[index] = data.publicUrl;
                                              
//                                               const { error } = await supabase
//                                                 .from("frontpage")
//                                                 .update({ Hero_images: updated })
//                                                 .eq("id", 1);

//                                               if (!error) {
//                                                 setHeroImages(updated);
//                                                 setReplaceHeroImage(null);
//                                                 setEditingHeroIndex(null);
//                                                 alert("Image replaced successfully!");
//                                               } else {
//                                                 alert("Error saving: " + error.message);
//                                               }
//                                             } else {
//                                               alert("Error uploading: " + uploadError.message);
//                                             }
//                                           }}
//                                           className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
//                                         >
//                                           ✓ Confirm Replace
//                                         </button>
//                                       </div>
//                                     )}
//                                   </div>

//                                   <button
//                                     onClick={() => {
//                                       setEditingHeroIndex(null);
//                                       setReplaceHeroImage(null);
//                                     }}
//                                     className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
//                                   >
//                                     Cancel
//                                   </button>
//                                 </div>
//                               ) : (
//                                 // View Mode
//                                 <div className="space-y-3">
//                                   {/* Action Buttons */}
//                                   <div className="grid grid-cols-2 gap-2">
//                                     <button
//                                       onClick={() => setEditingHeroIndex(index)}
//                                       className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all"
//                                     >
//                                       ✏️ Edit
//                                     </button>
//                                     <button
//                                       onClick={async () => {
//                                         if (!confirm("Are you sure you want to delete this image?")) return;
//                                         const updated = HeroImages.filter((_, i) => i !== index);
//                                         const { error } = await supabase
//                                           .from("frontpage")
//                                           .update({ Hero_images: updated })
//                                           .eq("id", 1);

//                                         if (!error) {
//                                           setHeroImages(updated);
//                                           alert("Image deleted successfully!");
//                                         } else {
//                                           alert("Error deleting: " + error.message);
//                                         }
//                                       }}
//                                       className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
//                                     >
//                                       🗑️ Delete
//                                     </button>
//                                   </div>

//                                   {/* Reorder Buttons */}
//                                   <div className="flex gap-2">
//                                     <button
//                                       onClick={async () => {
//                                         if (index === 0) return;
//                                         const updated = [...HeroImages];
//                                         [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
                                        
//                                         const { error } = await supabase
//                                           .from("frontpage")
//                                           .update({ Hero_images: updated })
//                                           .eq("id", 1);

//                                         if (!error) {
//                                           setHeroImages(updated);
//                                         } else {
//                                           alert("Error reordering: " + error.message);
//                                         }
//                                       }}
//                                       disabled={index === 0}
//                                       className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                                     >
//                                       ↑ Move Up
//                                     </button>
//                                     <button
//                                       onClick={async () => {
//                                         if (index === HeroImages.length - 1) return;
//                                         const updated = [...HeroImages];
//                                         [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                                        
//                                         const { error } = await supabase
//                                           .from("frontpage")
//                                           .update({ Hero_images: updated })
//                                           .eq("id", 1);

//                                         if (!error) {
//                                           setHeroImages(updated);
//                                         } else {
//                                           alert("Error reordering: " + error.message);
//                                         }
//                                       }}
//                                       disabled={index === HeroImages.length - 1}
//                                       className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                                     >
//                                       ↓ Move Down
//                                     </button>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}

//           </div>
//         </div>

//         {/* List Panel */}
//         <div className="w-full lg:w-80 flex-shrink-0">
//           <div className="bg-white rounded-xl shadow-lg p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
//             <div className="flex items-center justify-between mb-4 pb-4 border-b-2">
//               <h3 className="text-xl font-bold text-gray-800">
//                 {activeTab === "products" ? "🛋️ Products" : "📚 Articles"}
//               </h3>
//               <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
//                 {activeTab === "products" ? products.length : articles.length}
//               </span>
//             </div>


//             {activeTab === "products" ? (
//               // PRODUCTS LIST
//               <div className="space-y-3 overflow-y-auto flex-1">
//                 {products.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="text-6xl mb-4">🛋️</div>
//                     <p className="text-gray-400 font-medium">No products yet</p>
//                   </div>
//                 ) : (
//                   products.map((product) => (
//                     <div
//                       key={product.id}
//                       className={`border-2 rounded-xl p-4 transition-all ${
//                         editingProductId === product.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-blue-300"
//                       }`}
//                     >
//                       {product.featured && (
//                         <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold mb-2">
//                           ⭐ Featured
//                         </span>
//                       )}
//                       <h4
//                         onClick={() => editProduct(product)}
//                         className="font-bold text-sm text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
//                       >
//                         {product.name}
//                       </h4>
//                       {product.image_url && (
//                         <img
//                           src={product.image_url}
//                           alt={product.name}
//                           className="mb-2 w-full h-28 object-cover rounded-lg"
//                         />
//                       )}
//                       <p className="text-blue-600 font-bold text-sm mb-2">{product.price}</p>
//                       <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 mb-3">
//                         {product.category}
//                       </span>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => editProduct(product)}
//                           className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => deleteProduct(product.id)}
//                           className="flex-1 px-3 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             ) : (
              
//               <div className="space-y-3 overflow-y-auto flex-1">
//                 {/* ARTICLES LIST */}
//                 {articles.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="text-6xl mb-4">📝</div>
//                     <p className="text-gray-400 font-medium">No articles yet</p>
//                   </div>
//                 ) : (
//                   articles.map((article) => (
//                     <div
//                       key={article.id}
//                       className={`border-2 rounded-xl p-4 transition-all ${
//                         editingArticleId === article.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-200 hover:border-blue-300"
//                       }`}
//                     >
//                       <h4
//                         onClick={() => editArticle(article)}
//                         className="font-bold text-sm text-gray-800 mb-2 cursor-pointer hover:text-blue-600 line-clamp-2"
//                       >
//                         {article.title}
//                       </h4>
//                       {article.image_url && (
//                         <img
//                           src={article.image_url}
//                           alt={article.title}
//                           className="mb-2 w-full h-28 object-cover rounded-lg"
//                         />
//                       )}
                      
//                       {article.created_at && (
//                         <p className="text-xs text-gray-400 mb-3">
//                           📅 {new Date(article.created_at).toLocaleDateString()}
//                         </p>
//                       )}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => editArticle(article)}
//                           className="flex-1 px-3 py-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => deleteArticle(article.id)}
//                           className="flex-1 px-3 py-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManageProducts from "./ManageProducts";
import ManageBlog from "./ManageBlog";
import ManageSettings from "./ManageSettings";
import ManageFrontPage from "./ManageFrontpage";

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

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function ArticlesEditor() {
  const [activeTab, setActiveTab] = useState<"products" | "blog" | "frontpage" | "settings">("blog");
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  
  // Blog State
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Front Page State
  const [heroImages, setHeroImages] = useState<string[]>([]);
  
  // Settings State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState([""]);

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

  // Fetch Articles
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("created_at", { ascending: false });

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
  // Load Settings

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from("settings").select("*").single();

      if (data) {
        setEmail(data.store_email || "");
        setPhone(data.store_phone || "");

        const raw = data.working_hours;

        setHours(
          Array.isArray(raw)
            ? raw
            : raw
            ? [raw]
            : [""]
        );
      }
    };

    loadSettings();
  }, []);


  // Load Front Page
  useEffect(() => {
    const loadFrontPage = async () => {
      const { data } = await supabase.from("frontpage").select("*").maybeSingle();
      if (data?.hero_images) {
        setHeroImages(data.hero_images);
      }
    };

    loadFrontPage();
  }, []);

  // Initial Load
  useEffect(() => {
    fetchProducts();
    fetchArticles();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Mr. Futon Furniture</h1>
        <p className="text-gray-600">Manage your products and blog content</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 flex-wrap">
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
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "settings"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          ⚙️ Settings
        </button>
        <button
          onClick={() => setActiveTab("frontpage")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "frontpage"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          🖼️ Front Page
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "products" && (
          <ManageProducts 
            products={products} 
            fetchProducts={fetchProducts} 
          />
        )}
        
        {activeTab === "blog" && (
          <ManageBlog 
            articles={articles} 
            fetchArticles={fetchArticles} 
          />
        )}
        
        {activeTab === "settings" && (
          <ManageSettings
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            hours={hours}
            setHours={setHours}
          />
        )}
        
        {activeTab === "frontpage" && (
          <ManageFrontPage
            heroImages={heroImages}
            setHeroImages={setHeroImages}
          />
        )}
      </div>
    </div>
  );
}