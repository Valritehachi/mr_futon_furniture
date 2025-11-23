"use client";

import { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";
import SidebarPromo from "../components/SidebarPromo";
import HeroSlider from "../components/HeroSlider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";

import { supabase } from "@/utils/supabaseClient";

interface Post {
  id: number;
  title: string;
  content: string;
  published_at?: string;
}

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


export default function () {
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Accessories")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchAccessories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
        <section className="flex-grow p-8 bg-gray-50">
          <h1 className="text-4xl font-bold mb-12 text-center text-gray-700">
            Accessories
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No accessories available yet.</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-6xl">🛋️</div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-cyan-500">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
      {/* Footer */}
      <Footer />

    </div>

  );
}