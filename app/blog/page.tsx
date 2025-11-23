// "use client";

// import { useEffect, useState } from "react";
// import Logo from "@/app/components/Logo";
// import SidebarPromo from "../components/SidebarPromo";
// import HeroSlider from "../components/HeroSlider";
// import Navbar from "@/app/components/Navbar";
// import ReadMoreButton from "../components/ReadMoreButton";
// import Footer from "@/app/components/Footer";
// import Link from  "next/link"; 
// import Image from "next/image";

// import { supabase } from "@/utils/supabaseClient";

// interface Article {
//   id: number;
//   title: string;
//   content: string;
//   created_at: string;
//   image_url?: string;
// }

// export default function BlogPage() {
//   const [articles, setArticles] = useState<Article[]>([]);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       const { data, error } = await supabase
//         .from("blog")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (!error && data) setArticles(data as Article[]);
//     };

//     fetchArticles();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="min-h-screen flex flex-col">
//       {/* TOP LEFT: Logo and Navbar */}
//       <div className="flex flex-col gap-2 p-4">
//         <Logo />
//         <Navbar />
//       </div>

//       {/* MAIN CONTENT: Hero + Sidebar */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 px-4">
//         {/* Hero Slider */}
//         <div className="lg:col-span-8">
//           <HeroSlider />
//         </div>

//         {/* Sidebar Promo + Text */}
//         <div className="lg:col-span-4 flex flex-col gap-4">
//           <SidebarPromo />
//           <div className="font-bold text-lg ml-[60px]">
//             $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
//           </div>
//         </div>
//       </div>

//         {/* Page content */}
//         <section className="flex-grow p-25 bg-gray-50">
//           <h1 className="text-3xl font-bold mb-12 text-center text-gray-600">
//             Futon News and Views
//           </h1>

//           <div className="max-w-4xl mx-auto px-6 py-10">

//           <div className="space-y-8">
//             {articles.map((article) => (
//               <Link
//                 href={`/blog/${article.id}`}
//                 key={article.id}
//                 className="white border rounded-xl p-5 bg-white shadow hover:shadow-lg transition"
//               >
//                 {article.image_url && (
//                   <img
//                     src={article.image_url}
//                     alt={article.title}
//                     className="w-100 h-60 object-cover rounded-lg mb-4"
//                   />
//                 )}

//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   {article.title}
//                 </h2>

//                 <p
//                   className="text-gray-700 line-clamp-3"
//                   dangerouslySetInnerHTML={{ __html: article.content }}
//                 />
//                 <ReadMoreButton id={article.id} />
                
//               </Link>

              
//             ))}
//           </div>
//         </div>


        
//         </section>
      
//       </div>
      
//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";
import SidebarPromo from "../components/SidebarPromo";
import HeroSlider from "../components/HeroSlider";
import Navbar from "@/app/components/Navbar";
import ReadMoreButton from "../components/ReadMoreButton";
import Footer from "@/app/components/Footer";
import Link from "next/link";

import { supabase } from "@/utils/supabaseClient";

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setArticles(data as Article[]);
    };

    fetchArticles();
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
          <div className="font-bold text-lg ml-[60px]">
            $99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.
          </div>
        </div>
      </div>

      {/* Page content */}
      <section className="flex-grow p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-12 text-center text-gray-600">
          Futon News and Views
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                href={`/blog/${article.id}`}
                key={article.id}
                className="block rounded-xl p-6 bg-white shadow hover:shadow-lg transition"
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w- h-60 object-cover rounded-lg mb-4"
                  />
                )}

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h2>

                <p
                  className="text-gray-700 line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                <ReadMoreButton id={article.id} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}