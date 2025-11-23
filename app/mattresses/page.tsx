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

export default function MattressesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMattresses = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Mattresses")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchMattresses();
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
          <div className="font-bold text-lg ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* Page content */}
      <section className="flex-grow p-30 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-700">
          Futon Mattresses
        </h1>
        
        <p className="text-center text-2xl p-4 text-gray-600 mb-12 max-w-3xl mx-auto">
          Gold Bond stands today as one of the world’s top manufacturers of quality futon mattresses, 
          with dealers in 49 states and dozens of countries around the world. Why? Because we revolutionized 
          the futon mattress. And no one can match our standards for quality materials, craftsmanship, durability
          and value. From our simple all-cotton pads to the extraordinary Visco and innerspring models, a Gold Bond 
          is the ultimate choice in futon mattresses.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No mattresses available yet.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
              {products.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group block cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-rectangle h-25 bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md hover:shadow-xl transition-shadow">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                        🛋️
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-center text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Read More Button */}
                  <div className="text-center">
                    <span className="inline-block bg-gray-800 text-white px-6 py-2 rounded text-sm font-semibold group-hover:bg-gray-700 transition-colors">
                      Read more →
                    </span>
                  </div>

                </Link>
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