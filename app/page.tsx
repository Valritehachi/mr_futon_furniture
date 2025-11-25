'use client';

import HeroSlider from '@/app/components/HeroSlider';
import SidebarPromo from '@/app/components/SidebarPromo';
import Footer from '@/app/components/Footer';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import MovingPromotions from './components/MovingPromotions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';


interface Product {
  id: number;
  name: string;
  image_url: string;
  price: string;
  featured: boolean;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  start_date: string;
  end_date: string;
  special_price?: string;
  placement: string[];
  priority: number;
}



export default function Home() {

  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const loadFeaturedProduct = async () => {
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .limit(1)
        .maybeSingle();

      if (error) console.log(error);

      setFeaturedProduct(data);
      
    };

    loadFeaturedProduct();
  }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .lte("start_date", today)
        .gte("end_date", today)
        .order("priority", { ascending: false });

      if (error) {
        console.error("Error fetching promotions:", error);
        return;
      }

      // Filter only homepage placements and valid images
      const activePromos = (data || []).filter(
        p => p.placement?.includes("homepage") && p.image_url
      );

      setPromotions(activePromos);
    };

    fetchPromotions();
  }, []);


  const [advertImages, setAdvertImages] = useState({
    sofa_sleepers: "",
    mattresses: "",
    covers: "",
    space_savers: "",
    showroom: "",
    accessories: "",
  });

  useEffect(() => {
    const fetchAdvertImages = async () => {
      const { data } = await supabase
        .from("frontpage")
        .select("advert_images")
        .eq("id", 1)
        .single();

      if (data?.advert_images) {
        setAdvertImages(data.advert_images);
      }
    };

    fetchAdvertImages();
  }, []);


  return (
    <>
      {/* TOP LEFT: Logo and Navbar */}
      <div className="flex flex-col gap-2 px-4">
        <Logo />
        <Navbar />
        <MovingPromotions />
      </div>

      {/* MAIN CONTENT: Hero + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 px-4">
        <div className="md:col-span-8">
          <HeroSlider />
        </div>

        <div className="font-bold text-base md:col-span-4 md:text-lg text-center lg:text-left lg:ml-[60px]">
          <SidebarPromo />
          <div className="font-bold text-lg ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* WELCOME SECTION */}
      <section className="text-center mt-12 px-4">
        <h1 className="text-2xl md:text-3xl text-gray-600 font-bold">
          Welcome to Mr. Futon Furniture Store
        </h1>
        <p className="mt-2 text-gray-500 text-lg md:text-2xl">
          3300 South Congress Ave, Boynton Beach, FL 33426
        </p>
        
        <div className="mt-3 text-xl md:text-2xl text-gray-500 font-extrabold">
          (561) 572-3267
        </div>
        <h1 className="text-2xl md:text-4xl text-gray-600 font-bold mt-6">
          All Sofa Sleepers and Futon Mattresses are Made in the USA
        </h1>
         <p className="mt-2 text-gray-500 text-lg md:text-2xl">
          Visit our local showroom in Boynton Beach, Florida
        </p>


        {/* CATEGORY LINKS GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-12 md:my-20 gap-4 md:gap-6 mb-16">
          {/* Sofa Sleepers */}
          
          <a
            href="https://smallsofasleepers.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-[4/3] relative">
              {advertImages.sofa_sleepers && (
              <img
                src={advertImages.sofa_sleepers}
                alt="Sofa Sleepers"
                className="w-full h-full object-cover"
              />
            )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Sofa Sleepers</h3>
                <p className="text-sm">We have high quality sofa sleepers in a wide assortment of styles.</p>
              </div>
            </div>
          </a>
          

          {/* Futon Mattresses */}
          <Link href="/mattresses" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">

              {advertImages.mattresses && (
                <img
                  src={advertImages.mattresses}
                  alt="Futon Mattresses"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Futon Mattresses</h3>
                <p className="text-sm">Our comfortable futon mattresses are available in a number of thickness and support options.</p>
              </div>
            </div>
          </Link>

          {/* Futon Covers */}
          <Link href="/covers" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">

              {advertImages.covers && (
                <img
                  src={advertImages.covers}
                  alt="Futon Covers"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Futon Covers</h3>
                <p className="text-xs md:text-sm">We have a variety of futon covers in many colors and styles.</p>
              </div>
            </div>
          </Link>

          {/* Space Savers */}
          <Link href="/space-savers" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              {advertImages.space_savers && (
                <img
                  src={advertImages.space_savers}
                  alt="Space Savers"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
              <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Shop our Space Savers</h3>
                <p className="text-sm">A Space Saver is our own custom futon design that fits into small areas.</p>
              </div>
            </div>
          </Link>

          {/* Visit Showroom */}
          <Link href="/contact" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              {advertImages.showroom && (
                <img
                  src={advertImages.showroom}
                  alt="Visit our Showroom"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Visit our Showroom</h3>
                <p className="text-sm">3300 S. Congress Ave, Boynton Beach FL 33426</p>
              </div>
            </div>
          </Link>

          {/* Accessories */}
          <Link href="/accessories" className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <div className="aspect-[4/3] relative">
              {advertImages.accessories && (
                <img
                  src={advertImages.accessories}
                  alt="Accessories"
                  className="w-full h-48 md:h-64 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Shop our Accessories</h3>
                <p className="text-sm">Get our matching end tables, coffee tables or drawer systems to complete your room.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* CUSTOMER REVIEW */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-6 md:p-8 mb-16">
          <p className="text-base md:text-lg text-gray-700 italic mb-4">
            "Thank you! Thank you! Thank you! I am so happy with the beautiful and very comfortable futon Mr. Futon built for my home!{" "}
            <span className="font-bold">Excellent</span> experience from the very start, to now the delivery and set up of this awesome piece of furniture! 
            I didn't think such craftsmanship, pride and service existed any more, but it does with Mark, Mr. Futon!"
          </p>
          <p className="text-gray-600 font-semibold">— Irena, Google Review</p>
        </div>

        
        {/* ⭐ FEATURED PRODUCT */}
        {featuredProduct && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 mb-16">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              ⭐ Featured Product
            </h2>

            <img
              src={featuredProduct.image_url}
              alt={featuredProduct.name}
              className="w-full h-90 object-cover rounded-lg mb-6"
            />

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {featuredProduct.name}
            </h3>

            <p className="text-blue-700 font-bold text-lg mb-6">
              {featuredProduct.price}
            </p>

            <Link
              href={`/products/${featuredProduct.id}`}
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Product →
            </Link>
          </div>
        )}


        {/* ANSWERS TO COMMON QUESTIONS */}
        <div className="max-w-7xl mx-auto mb-16">
          <h1 className="text-3xl font-bold underline underline-offset-6 text-underline text-blue-800 mb-8">Answers to Common Futon Questions</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Article 1 */}
            <Link href="/blog/7" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                
                <img 
                  src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/1763776546627_Futon-Albany-Arm-Cherry-FeaturedImage.jpg" 
                  alt="How much should you spend on a futon?"
                  className="w-70 h-50 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    How much should you spend on a futon?
                  </h3>
                </div>
              </div>
            </Link>

            {/* Article 2 */}
            <Link href="/blog/6" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <img 
                  src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/1763762291418_Futon-Fuji-Arm-Dark-Chocolate-FeaturedImage.jpg" 
                  alt="Are Futons OK for Sleeping On Every Night?"
                  className="w-70 h-50 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    Are Futons OK for Sleeping On Every Night?
                  </h3>
                </div>
              </div>
            </Link>

          </div>
        </div>


      </section>

      <Footer />
    </>
  );
  }