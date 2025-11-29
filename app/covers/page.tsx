"use client";

import { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";
import SidebarPromo from "../components/SidebarPromo";
import HeroSlider from "../components/HeroSlider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

import { supabase } from "@/utils/supabaseClient";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url?: string;
  featured?: boolean;
  mattress_options?: Array<{ 
    size: string; 
    price: string;
    image_url?: string; 
  }>;
}

export default function CoversPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCovers = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Covers")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchCovers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP LEFT: Logo and Navbar */}
      <div className="flex flex-col gap-2 p-4">
        <Logo />
        <Navbar />
      </div>

      {/* MAIN CONTENT: Hero + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 px-4">
        {/* Hero Slider */}
        <div className="md:col-span-8">
          <HeroSlider />
        </div>

        {/* Sidebar Promo + Text */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <SidebarPromo />
          <div className="font-bold justify-start text-lg ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* Page content */}
      <section className="flex-grow p-4 sm:p-6 md:p-8 bg-gray-50">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-700">
          Futon Covers
        </h1>
        
        <p className="text-center text-base sm:text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Just a small sample or what is available, there are hundreds of fabrics in the store to choose from.
          Prices start at $60 for a full solid.
        </p>

        {loading ? (
          <div className="text-center py-10 sm:py-20">
            <p className="text-lg sm:text-xl text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 sm:py-20">
            <p className="text-lg sm:text-xl text-gray-500">No covers available yet.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md hover:shadow-xl transition-shadow">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl sm:text-5xl">
                        🛋️
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}