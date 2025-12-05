"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import ManageProducts from "./ManageProducts";
import ManageBlog from "./ManageBlog";
import ManageSettings from "./ManageSettings";
import ManageFrontPage from "./ManageFrontpage";
import ManagePromotions from "./ManagePromotions";

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

interface HeroImage {
  url: string;
  text: string;
}

export default function ArticlesEditor() {
  const [activeTab, setActiveTab] = useState<"products" | "blog" | "frontpage" | "settings" | "promotions">("blog");

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  
  // Blog State
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Front Page State - INITIALIZE WITH EMPTY ARRAY
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  
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

  // Load Front Page - FIXED VERSION
  useEffect(() => {
    const loadFrontPage = async () => {
      const { data, error } = await supabase
        .from("frontpage")
        .select("hero_images")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error loading frontpage:", error);
        return;
      }

      if (data && data.hero_images) {
        let parsedImages: HeroImage[] = [];

        if (Array.isArray(data.hero_images)) {
          parsedImages = data.hero_images
            .map((img: any) => {
              // If it's already an object with url
              if (typeof img === 'object' && img !== null && img.url) {
                return {
                  url: img.url || '',
                  text: img.text || ''
                };
              }
              // If it's a string, try to parse it
              if (typeof img === 'string') {
                // Check if it's a JSON string
                if (img.startsWith('{')) {
                  try {
                    const parsed = JSON.parse(img);
                    return {
                      url: parsed.url || '',
                      text: parsed.text || ''
                    };
                  } catch (e) {
                    console.error("Failed to parse image string:", img, e);
                    return null;
                  }
                }
                // If it's just a URL string
                return { url: img, text: '' };
              }
              return null;
            })
            .filter((img): img is HeroImage => 
              img !== null && 
              typeof img.url === 'string' && 
              img.url.length > 0 &&
              img.url.startsWith('http')
            );
        }

        console.log("Parsed hero images:", parsedImages);
        setHeroImages(parsedImages);
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

        <button
          onClick={() => setActiveTab("promotions")}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === "promotions"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          🎁 Promotions
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

        {activeTab === "promotions" && (
          <ManagePromotions />
        )}
      </div>
    </div>
  );
}