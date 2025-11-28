"use client";

import Logo from "@/app/components/Logo";
import Navbar from "@/app/components/Navbar";
import HeroSlider from "@/app/components/HeroSlider";
import SidebarPromo from "@/app/components/SidebarPromo";
import ContactForm from "../components/ContactForm";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";


export default function ContactPage() {
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("store_phone, store_email, working_hours")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Failed to fetch settings:", error);
      } else if (data) {
        setPhone(data.store_phone);
        setEmail(data.store_email);
        let hoursArray: string[] = [];
        try {
          hoursArray = JSON.parse(data.working_hours);
        } catch {
          // if parsing fails, just put it as single string
          hoursArray = [data.working_hours];
        }

        setHours(hoursArray);
      }
    };

    fetchSettings();
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
            <div className="font-bold justify-start text-lg ml-[60px]">
              $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*                    CONTACT US SECTION                   */}
        {/* -------------------------------------------------------- */}

        <div className="w-full mt-6 sm:mt-10 max-w-full sm:max-w-7xl mx-auto px-4">
          <div className="text-center text-base sm:text-lg text-gray-500 space-y-4">
            <p>
              MR. FUTON FURNITURE has been manufacturing futon furniture in the USA, supplying Florida 
              stores for over 35 years. Mr. Futon offers a large selection of futon frames, futon mattresses, 
              and futon covers. Mr. Futon serves customers in West Palm Beach, Boynton Beach, Fort Lauderdale 
              and Miami and can deliver to many locations in South Florida.
            </p>
          </div>

          <div className="relative bg-gray-100 text-gray-700 py-8 sm:py-10 mt-4 rounded-lg">
            <div className="max-w-full sm:max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

              {/* Column 1: Contact */}
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-bold text-lg sm:text-xl">Mr Futon Furniture</h3>
                <p className="text-base sm:text-lg">{email}</p>
                <p className="text-base sm:text-lg">{phone}</p>
              </div>

              {/* Column 2: Quick Links */}
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-bold text-lg sm:text-xl">By Appointment Only:</h3>
                <h3 className="font-bold text-lg sm:text-xl">Please call {phone}</h3>
                {hours.map((hour, index) => (
                  <p key={index} className="text-base sm:text-lg">{hour}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
       
        {/* Contact Info Bar */}
        <div className="w-full mt-6 sm:mt-12 max-w-full sm:max-w-7xl mx-auto bg-[#7EC9F3] py-4 px-4 sm:px-6 text-base sm:text-xl font-medium text-gray-700 text-center rounded-lg">
          Contact us using the form below. We will respond to you within 24 hours.
        </div>

        {/* Contact Form */}
        <div className="max-w-full sm:max-w-4xl mx-auto py-10 sm:py-14 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-700">
            Contact Us
          </h2>

          {/* Contact Form Component */}
          <ContactForm />
        </div>

        {/* -------------------------------------------------------- */}
        {/*                     MAP & DIRECTIONS                    */}
        {/* -------------------------------------------------------- */}

        <div className="w-full mt-10 max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="bg-[#7EC9F3] py-3 sm:py-4 px-4 text-lg sm:text-xl font-medium text-gray-700 text-center rounded-lg">
            Map & Directions
          </div>

          {/* Responsive Google Map */}
          <div className="mt-4 rounded-xl overflow-hidden aspect-[16/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.7909042242345!2d-80.09193382353156!3d26.494676476898796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8df83a7ef00c9%3A0x11483dc8364760b4!2sMr.%20Futon%20Furniture!5e0!3m2!1sen!2sus!4v1763582063244!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*                 VISIT OUR SHOWROOM SECTION              */}
        {/* -------------------------------------------------------- */}

        <div className="w-full mt-10 max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="bg-[#7EC9F3] py-3 sm:py-4 px-4 text-lg sm:text-xl font-medium text-gray-700 text-center rounded-lg">
            Visit Our Showroom
          </div>

          {/* Showroom Image */}
          <div className="flex justify-center mt-4 mb-6">
            <Image
              src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_showroom.png"
              alt="Showroom"
              width={1500}
              height={450}
              className="w-full h-auto max-w-full rounded-md shadow-md"
            />
          </div>
        </div>


        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}