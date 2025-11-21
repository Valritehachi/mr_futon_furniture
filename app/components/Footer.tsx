"use client";

import React from "react";
import { useEffect, useState } from "react";// components/Footer.tsx


export default function Footer() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

  return (
    <footer className="relative bg-gray-100 text-gray-700 py-10 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Contact */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Mr Futon Furniture</h3>
          <p>Mr Futon Furniture & Sofa Beds</p>
          <p>3300 S Congress Ave #14</p>
          <p>Boynton Beach, FL 33426</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/futon-sets" className="hover:underline">Futon Sets</a></li>
            <li><a href="/mattresses" className="hover:underline">Mattresses</a></li>
            <li><a href="/covers" className="hover:underline">Covers</a></li>
            <li><a href="/space-savers" className="hover:underline">Space Savers</a></li>
            <li><a href="/accessories" className="hover:underline">Accessories</a></li>
            <li><a href="/blog" className="hover:underline">Blog</a></li>
            <li><a href="/about-us" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 3: Service Areas / Copyright */}
        <div className="space-y-2">
          <p className="text-sm">&copy; 2022 Mr Futon Furniture & Sofa Beds</p>
          <p>We serve all of South Florida:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>The Best Futons in Miami-Dade</li>
            <li>The Best Futons in Boca Raton</li>
            <li>The Best Futons in Fort Lauderdale</li>
            <li>The Best Futons in West Palm Beach</li>
            <li>Futons Near Me</li>
            <li>The Best Futons in South Florida</li>
          </ul>
        </div>

        {/* Scroll to Top Button */}
   
            <button
                onClick={scrollToTop}
                className="absolute bottom-4 right-4 w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-700 rounded shadow-lg hover:bg-blue-500 hover:text-white transition text-3xl"
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </div>
    </footer>
  );
}