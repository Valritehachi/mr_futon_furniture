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

export default function FutonSetsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFutonSets = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Futon Sets")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchFutonSets();
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
          <div className="font-bold text-base md:text-lg text-center lg:text-left lg:ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* Page content */}
      <section className="flex-grow p-2 md:p-30 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-700">
          Futon Sets
        </h1>

        <h1 className="text-2xl font-semibold mb-2 text-center text-gray-600">
          These prices include a solid oak frame
          with a deluxe  Gold Bond Futon mattress
        </h1>

        <p className="text-center text-2xl p-4 text-gray-600 mb-12 max-w-3xl mx-auto">
          Exceptional value combined with easy crisp styling looks good, sits good, feels good. Our Futon Collection Wood 
          Frames are made in our own factories right here in the USA. These quality frames are made from the finest hard woods.
          Handsome finishes make this futon collection a smart choice for your home..
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No futon sets available yet.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-20">
              {products.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group block cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="w-full mb-4 flex items-center justify-center">
                  {product.image_url ? (
                    <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/9]">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/9] flex items-center justify-center text-gray-400 text-6xl bg-gray-100 rounded-lg">
                      🛋️
                    </div>
                  )}
                </div>

                  {/* Product Name */}
                  <h3 className="text-center text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Product Name */}
                  <h3 className="text-center text-lg font-semibold text-sky-400 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.price}
                  </h3>

                  {/* Read More Button */}
                  {/* <div className="text-center">
                    <span className="inline-block bg-sky-300 text-white px-6 py-2 rounded text-sm font-semibold group-hover:bg-gray-700 transition-colors">
                      Read more →
                    </span>
                  </div> */}

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