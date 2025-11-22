"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRef } from "react";




export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-6">


        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {mobileMenuOpen ? (
              <path d="M6 6L18 18M6 18L18 6" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>

        {/* LOGO + NAV ITEMS */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          {/* <Link href="/">
            <a className="flex items-center">
              <Image src="/images/logo.png" alt="Mr Futon" width={180} height={60} />
            </a>
          </Link> */}

          <nav className="hidden md:flex text-base lg:text-xl">
            <ul className="flex items-center gap-4 lg:gap-8">
              <li>
                <Link href="/" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Home</Link>
              </li>

              <li>
                <Link href="/futon-sets" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Futon Sets</Link>
              </li>
              
              <li>
                <Link href="/mattresses" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Mattresses</Link>
              </li>
              
              <li>
                <Link href="/covers" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Covers</Link>
              </li>
              
              <li>
                <a
                  href="https://smallsofasleepers.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12"
                >
                  Space Savers
                </a>
              </li>
              
              <li>
                <Link href="/accessories" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Accessories</Link>
              </li>
              
              <li>
                <Link href="/blog" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Blog</Link>
              </li>
              
              <li>
                <Link href="/about-us" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">About Us</Link>
              </li>
              
              <li>
                <Link href="/contact" className="hover:underline hover:decoration-[#93C5FD] hover:decoration-2 hover:underline-offset-12">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* RIGHT SIDE: Search */}
        <div className="flex items-center gap-8 text-sm">

          {/* Search dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 border-2 border-black-400 rounded hover:bg-blue-50 transition"
            >
              {open ? (
                // X Icon
                <svg width="28" height="28" viewBox="0 0 24 24" className="stroke-current text-black-600">
                  <path d="M6 6l12 12M6 18L18 6" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              ) : (
                // Full magnifying glass icon
                <svg width="28" height="28" viewBox="0 0 24 24" className="stroke-current text-black-600">
                  <circle cx="10" cy="10" r="6" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <line x1="14" y1="14" x2="20" y2="20" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
            </button>

            {open && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50 animate-fadeIn">

                {/* Search Input */}
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M21 21l-4.35-4.35" stroke="gray" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full text-sm focus:outline-none"
                  />
                </div>

                {/* Search Suggestions */}
                <ul className="mt-3 max-h-48 overflow-auto text-sm">
                  <li className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer">Futon Sofa</li>
                  <li className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer">Premium 8" Mattress</li>
                  <li className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer">Wooden Frame Combo</li>
                  <li className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer">Removable Covers</li>
                </ul>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-white">
          <ul className="flex flex-col py-4">
            <li>
              <Link href="/" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/futon-sets" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Futon Sets</Link>
            </li>
            <li>
              <Link href="/mattresses" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Mattresses</Link>
            </li>
            <li>
              <Link href="/covers" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Covers</Link>
            </li>
            <li>
              <a
                href="https://smallsofasleepers.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Space Savers
              </a>
            </li>
            <li>
              <Link href="/accessories" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
            </li>
            <li>
              <Link href="/blog" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            </li>
            <li>
              <Link href="/about-us" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}