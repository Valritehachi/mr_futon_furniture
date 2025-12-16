"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManageSofaHeroImages from "./ManageSofaSleeperHero";

 

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface SofaSleeperProduct {
  id?: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  image_url: string | null;
  gallery: string[];
}


export default function ManageSofaSleeperProducts() {
  const [products, setProducts] = useState<SofaSleeperProduct[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchProducts = async () => {
    const { data } = await supabase()
      .from("products")
      .select("*")
      .eq("category", "space-saver")
      .order("id", { ascending: false });

    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const generateSlug = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove symbols
        .replace(/\s+/g, "-")         // spaces → hyphens
        .replace(/-+/g, "-");         // collapse hyphens

  /* ---------------- UPLOAD HELPERS ---------------- */

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase()
      .storage
      .from("images")
      .upload(fileName, file);

    if (error) return null;

    const { data } = supabase()
      .storage
      .from("images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const uploadGallery = async (): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of galleryFiles) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }

    return urls;
  };

  /* ---------------- SAVE ---------------- */

  const saveProduct = async () => {
    if (!name || !slug) {
      alert("Name and slug are required");
      return;
    }

    setLoading(true);

    const imageUrl =
      mainImage ? await uploadImage(mainImage) : currentImage;

    const galleryUrls =
      galleryFiles.length > 0
        ? await uploadGallery()
        : currentGallery;

    const payload = {
      name,
      slug,
      price,
      description,
      category: "space-saver",
      image_url: imageUrl,
      gallery: galleryUrls,
    };

    const { data: existing } = await supabase()
        .from("products")
        .select("id")
        .eq("slug", slug)
        .neq("id", editingId ?? 0)
        .single();

        if (existing) {
        alert("A product with this slug already exists.");
        setLoading(false);
        return;
    }


    if (editingId) {
      await supabase()
        .from("products")
        .update(payload)
        .eq("id", editingId);
    } else {
      await supabase()
        .from("products")
        .insert([payload]);
    }

    resetForm();
    await fetchProducts();
    setLoading(false);
  };

  /* ---------------- EDIT / DELETE ---------------- */

  const editProduct = (p: SofaSleeperProduct) => {
    setEditingId(p.id!);
    setName(p.name);
    setSlug(p.slug);
    setPrice(p.price);
    setDescription(p.description);
    setCurrentImage(p.image_url);
    setCurrentGallery(p.gallery || []);
    setMainImage(null);
    setGalleryFiles([]);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await supabase().from("products").delete().eq("id", id);
    fetchProducts();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setPrice("");
    setDescription("");
    setMainImage(null);
    setCurrentImage(null);
    setGalleryFiles([]);
    setCurrentGallery([]);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* FORM */}
      <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "Edit Sofa Sleeper" : "Add Sofa Sleeper"}
        </h2>

        <input
            placeholder="Product name"
            value={name}
            onChange={(e) => {
                const value = e.target.value;
                setName(value);

                // Auto-generate slug ONLY if user hasn’t edited it manually
                if (!editingId) {
                setSlug(generateSlug(value));
                }
            }}
            className="w-full mb-3 p-3 border rounded"
        />


        <input
          placeholder="slug-example-name"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          placeholder="$399.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-3 p-3 border rounded"
        />

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
            </label>

            <ReactQuill
                value={description}
                onChange={setDescription}
                theme="snow"
                className="bg-white rounded"
            />
        </div>

        {/* MAIN IMAGE */}
        <label className="font-bold block mb-2">Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && setMainImage(e.target.files[0])
          }
        />

        {currentImage && (
          <img src={currentImage} className="h-32 mt-3 rounded" />
        )}

        {/* GALLERY */}
        <label className="font-bold block mt-6 mb-2">
          Gallery Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            setGalleryFiles(Array.from(e.target.files))
          }
        />

        <div className="grid grid-cols-4 gap-2 mt-3">
          {currentGallery.map((img, i) => (
            <img key={i} src={img} className="h-20 object-cover rounded" />
          ))}
          {galleryFiles.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              className="h-20 object-cover rounded"
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={saveProduct}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded font-bold"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 px-6 py-3 rounded font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">
          Sofa Sleeper Products
        </h3>

        {products.map((p) => (
        <div
            key={p.id}
            className="mb-4 border-b pb-4 cursor-pointer hover:bg-gray-50 rounded p-2"
            onClick={() => editProduct(p)}
        >
            {/* IMAGE */}
            {p.image_url && (
            <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-32 object-cover rounded mb-2"
            />
            )}

            {/* NAME */}
            <h4 className="font-bold hover:text-blue-600">
            {p.name}
            </h4>

            {/* PRICE */}
            <p className="text-sm text-gray-600">{p.price}</p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-2">
            <button
                onClick={(e) => {
                e.stopPropagation();
                editProduct(p);
                }}
                className="text-blue-600 text-sm"
            >
                Edit
            </button>

            <button
                onClick={(e) => {
                e.stopPropagation();
                deleteProduct(p.id!);
                }}
                className="text-red-600 text-sm"
            >
                Delete
            </button>
            </div>
        </div>
        ))}
        
      </div>
      
       {/* ================= SOFA HERO MANAGER (FULL WIDTH) ================= */}
        <div className="col-span-full bg-white p-8 rounded-xl shadow">
            <ManageSofaHeroImages />
        </div>
    </div>
    
  );
}
