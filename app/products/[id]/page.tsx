
"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Logo from "@/app/components/Logo";
import BackLink from "@/app/components/BackLink";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MattressSelector from "@/app/components/MattressSelector";
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
  mattress_options?: Array<{ 
    size: string; 
    price: string;
    image_url?: string;
  }>;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", id);
      
      const { data, error } = await supabase()
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      console.log("Product fetch result:", { data, error });

      if (!error && data) {
        setProduct(data as Product);
        
        // Set initial display image to primary product image
        setDisplayImage(data.image_url || null);
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Build image gallery array (primary image + mattress images)
  const imageGallery: Array<{ url: string; label: string }> = [];
  
  // Add primary product image first
  if (product.image_url) {
    imageGallery.push({ url: product.image_url, label: "Main View" });
  }
  
  // Add mattress images for Futon Sets
  if (product.category === "Futon Sets" && product.mattress_options) {
    product.mattress_options.forEach(option => {
      if (option.image_url) {
        imageGallery.push({ url: option.image_url, label: option.size });
      }
    });
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
          <BackLink category={product.category} />

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Image Section with Gallery */}
              <div>
                {/* Main Display Image */}
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-8 mb-4">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-contain transition-all duration-300"
                    />
                  ) : (
                    <div className="text-gray-400 text-9xl">🛋️</div>
                  )}
                </div>

                {/* Thumbnail Gallery - Only show if there are multiple images */}
                {imageGallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imageGallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setDisplayImage(image.url)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                          displayImage === image.url
                            ? "border-blue-600 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {product.category === "Futon Sets" && product.mattress_options && product.mattress_options.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold text-sky-400 mb-6">
                      {product.mattress_options[0].price} – {product.mattress_options[product.mattress_options.length - 1].price}
                    </p>
                    <MattressSelector 
                      options={product.mattress_options}
                      onImageChange={setDisplayImage}
                    />
                  </>
                ) : (
                  <p className="text-3xl text-blue-500 mb-6">
                    {product.price}
                  </p>
                )}

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