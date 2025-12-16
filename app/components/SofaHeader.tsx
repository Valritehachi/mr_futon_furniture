// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import SiteSearch from "./SiteSearch";


// export default function SofaHeader() {
//   const router = useRouter();
//   const [search, setSearch] = useState("");
  
//   return (
//     <header className="w-full border-b bg-white">
//       {/* TOP ROW */}
//       <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        
//         {/* LEFT: LOGO + TITLE */}
//         <div className="flex items-center gap-4">
          
//           <img
//             src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/sofasleapericon.png"
//             alt="Sofa Sleeper"
//             width={120}
//             height={120}
//           />


//           <div>
//             <h1 className="text-3xl font-extrabold">Small Sofa Sleeper Store</h1>
//             <p className="text-gray-600 text-lg mt-2">Big ideas for small spaces</p>
//           </div>
//         </div>

//         {/* NAV LINKS */}
//         <nav className="hidden md:flex ml-auto mr-6">
//           <ul className="flex gap-6 text-sm font-medium list-none p-0 m-0">
//             <li>
//               <Link href="/about-us" className="hover:text-blue-600">About</Link>
//             </li>
//             <li>
//               <Link href="/blog" className="hover:text-blue-600">Blog</Link>
//             </li>
//             <li>
//               <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
//             </li>
//           </ul>
//         </nav>


//         {/* RIGHT SIDE: Back Button */}
//         <div className="flex items-center">
//           <Link
//             href="/"
//             className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition text-sm font-semibold"
//           >
//             👈 Back to <br />
//             Futon Store
//           </Link>
//         </div>

//       </div>

//       {/* BOTTOM ACTION BAR */}
//       <div className="w-full border-t bg-white">
//         <div className="max-w-7xl mx-auto flex items-center gap-6 py-3 px-4">

//           {/* LEFT LABEL (REPLACEMENT FOR TOP CATEGORIES) */}
//           <div className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
//             Browse Sofa Sleepers
//           </div>

//           {/* SEARCH BAR */}
//           <div className="flex items-center flex-1 max-w-xl ml-auto">
//             <input
//               type="text"
//               placeholder="Search sofa sleepers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && search.trim()) {
//                   router.push(`/search?q=${encodeURIComponent(search)}`);
//                 }
//               }}
//               className="w-full border px-4 py-2 rounded-l bg-gray-50 focus:outline-none text-gray-700"
//             />

//             {/* RIGHT SIDE: Search */}
//               <div className="flex items-center gap-8 text-sm">
      
//                 {/* Search dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={() => setOpen(!open)}
//                     className="p-2 border-2 border-black-400 rounded hover:bg-blue-50 transition"
//                   >
//                     {open ? (
//                       // X Icon
//                       <svg width="28" height="28" viewBox="0 0 24 24" className="stroke-current text-black-600">
//                         <path d="M6 6l12 12M6 18L18 6" strokeWidth="4" strokeLinecap="round"/>
//                       </svg>
//                     ) : (
//                       // Full magnifying glass icon
//                       <svg width="28" height="28" viewBox="0 0 24 24" className="stroke-current text-black-600">
//                         <circle cx="10" cy="10" r="6" strokeWidth="3" strokeLinecap="round" fill="none"/>
//                         <line x1="14" y1="14" x2="20" y2="20" strokeWidth="3" strokeLinecap="round"/>
//                       </svg>
//                     )}
//                   </button>
      
//                   {open && (
//                     <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
      
//                       <SiteSearch />
      
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SofaHeader() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <header className="w-full border-b bg-white">
      {/* ================= TOP ROW ================= */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        
        {/* LEFT: LOGO + TITLE */}
        <div className="flex items-center gap-4">
          <img
            src="https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/sofasleapericon.png"
            alt="Sofa Sleeper"
            width={120}
            height={120}
          />

          <div>
            <h1 className="text-3xl font-extrabold">
              Small Sofa Sleeper Store
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Big ideas for small spaces
            </p>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex ml-auto mr-6">
          <ul className="flex gap-6 text-sm font-medium list-none p-0 m-0">
            <li>
              <Link href="/about-us" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT: BACK BUTTON */}
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

      {/* ================= BOTTOM CATEGORY BAR ================= */}
      <div className="w-full border-t bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 gap-6">

          {/* CATEGORY: SOFA SLEEPERS */}
          <button
            onClick={() => router.push("/space-savers")}
            className="font-medium text-gray-700 hover:text-black whitespace-nowrap"
          >
            Sofa Sleepers
          </button>

          {/* SEARCH BAR */}
          <div className="flex items-center flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  router.push(`/space-savers?q=${encodeURIComponent(search)}`);

                }
              }}
              className="w-full border px-4 py-2 rounded-l bg-gray-50 focus:outline-none text-gray-700"
            />
            <button
              onClick={() => {
                if (search.trim()) {
                  router.push(`/space-savers?q=${encodeURIComponent(search)}`);

                }
              }}
              className="border border-l-0 px-4 py-2 bg-gray-100 rounded-r hover:bg-gray-200"
            >
              🔍
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
