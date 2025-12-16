"use client";

import Image from "next/image";
import Link from "next/link";

export default function SofaHeader() {
  return (
    <header className="w-full border-b bg-white">
      {/* TOP ROW */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        
        {/* LEFT: LOGO + TITLE */}
        <div className="flex items-center gap-4">
          {/* <Image
            src="/images/sofasleapericon.png"
            alt="Small Sofa Icon"
            width={120}
            height={120}
            priority
          /> */}
          <img
            src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/sofasleapericon.png"
            alt="Sofa Sleeper"
            width={120}
            height={120}
          />


          <div>
            <h1 className="text-3xl font-extrabold">Small Sofa Sleeper Store</h1>
            <p className="text-gray-600 text-lg mt-2">Big ideas for small spaces</p>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex ml-auto mr-6">
          <ul className="flex gap-6 text-sm font-medium list-none p-0 m-0">
            <li>
              <Link href="/about-us" className="hover:text-blue-600">About</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
            </li>
          </ul>
        </nav>


        {/* RIGHT SIDE: Back Button */}
        <div className="flex items-center">
          <Link
            href="/"
            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition text-sm font-semibold"
          >
            👈 Back to <br />
            Futon Store
          </Link>
        </div>

      </div>

      {/* BOTTOM CATEGORY BAR */}
      <div className="w-full border-t bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
          <button className="flex items-center gap-2 text-gray-700">

            <span className="font-medium">Top Categories</span>
          </button>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-xl mx-6">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border px-4 py-2 rounded-l bg-gray-50 focus:outline-none text-gray-700"
            />
            <button className="border border-l-0 px-4 py-2 bg-gray-100 rounded-r">
              <span className="material-icons">search</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
