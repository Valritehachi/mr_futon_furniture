"use client";

import { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";
import SidebarPromo from "../components/SidebarPromo";
import HeroSlider from "../components/HeroSlider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";

import { supabase } from "@/utils/supabaseClient";

interface Post {
  id: number;
  title: string;
  content: string;
  published_at?: string;
}

export default function () {
  const [posts, setPosts] = useState<Post[]>([]);

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
        <section className="flex-grow p-25 bg-gray-50">
          <h1 className="text-3xl font-bold mb-12 text-center text-gray-600">
            About Us
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
            <p>
              Mr. Futon Furniture Company has a rich history spanning over 35 years as a prominent manufacturer of futon furniture in the USA. Founded with a vision to provide high-quality futon products, the company has been dedicated to supplying Florida stores with a wide range of options for futon frames, futon mattresses, and futon covers.
              Since its establishment, Mr. Futon Furniture has built a solid reputation for its commitment to craftsmanship and attention to detail. The company takes pride in producing futon furniture that combines functionality, comfort, and style. Their extensive selection of futon frames ensures that customers can find the perfect fit for their preferences and decor.
              When it comes to futon mattresses, Mr. Futon Furniture excels in offering a diverse range of Gold Bond futon mattresses tailored to meet varying comfort needs. Customers can find the ideal level of support and softness for a restful sleep or comfortable seating experience.
            </p>
            <p>
              In addition to frames and mattresses, Mr. Futon Furniture understands the importance of personalization. With an array of futon covers available, customers can effortlessly customize their futons to match their individual style and enhance the aesthetic appeal of their living spaces. From vibrant patterns to elegant solids, the options are plentiful, ensuring that each customer can find a cover that complements their unique taste.
            </p>
            <p>
              Over the years, Mr. Futon Furniture has continuously evolved its product offerings and manufacturing techniques, staying abreast of changing trends and customer demands. With a commitment to using high-quality materials and employing skilled craftsmanship, the company has consistently delivered durable and long-lasting futon furniture that withstands the test of time.
            </p>
            <p>As a trusted supplier to Florida stores, Mr. Futon Furniture has become a go-to destination for customers seeking reliable and stylish futon solutions. Their dedication to excellence, combined with a customer-centric approach, has fostered lasting relationships with both retailers and consumers alike.</p>
            {/* Add image */}
            <div className="flex justify-center">
              <Image
                src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_about_us.jpg"
                alt="Mr. Futon Showroom"
                width={600}
                height={400}
                className="rounded shadow"
              />
             
            </div>
            <p className="mt-4 text-center text-lg text-gray-500">
              Frames are hand made in South Florida.
            </p>
            
          </div>
        </section>
      </div>
      {/*additional content- google review*/}
      <div className="bg-blue-100 p-6 rounded-lg max-w-5xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-left text-gray-600">
          From Google:
        </h2>

        <div className="text-center text-gray-700 space-y-4">
          <p>
            Mark is exceptional with almost 40 years of experience in his business. 
            He is very polite, well mannered and a professional. He showed us every 
            option to help us choose the right product and material for our futon. 
            Very happy with our new quality futon cover and the service. The price was 
            very reasonable and the product arrived quickly. Highly recommended *****
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}