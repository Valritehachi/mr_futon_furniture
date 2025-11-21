"use client";


import { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Logo from "@/app/components/Logo";
import BackLink from "@/app/components/BackLink";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise
  const { id } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", id);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      console.log("Product fetch result:", { data, error });

      if (!error && data) {
        setProduct(data as Product);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col gap-2 p-4">
          <Logo />
          <Navbar />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-500 mb-4">Product not found</p>
            {/* Back Button */}
            {product && <BackLink category={(product as Product).category} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo and Navbar */}
      <div className="flex flex-col gap-2 p-4">
        <Logo />
        <Navbar />
      </div>

      {/* Product Details */}
      <section className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          {product && <BackLink category={(product as Product).category} />}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-8">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-9xl">🛋️</div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <p className="text-3xl font-bold text-cyan-500 mb-6">
                  {product.price}
                </p>

                <div className="mb-6">
                  <span className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>

                {product.description && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Description
                    </h2>
                    <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>
                )}

                {/* Call to Action */}
                <div className="space-y-4">
                  <Link
                    href="/contact"
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center font-bold py-4 px-6 rounded-lg transition-colors"
                  >
                    ✉️ Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}