// import Header from "./components/Header";
// import Navbar from "./components/Navbar";
// import Image from "next/image";
// import Sidebar from "./components/sidebar";
// import Searchbar from "./components/SearchBar";
// import ReadMoreButton from "./components/ReadMoreButton";
// import { supabase } from "@/utils/supabaseClient";
// import { useEffect, useState } from "react";  
// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   image_url?: string;
// }     
// import { Search } from "lucide-react";
// import Link from "next/link";



// export default function Home() {
//   return (
//     <main className="flex flex-col min-h-screen">
//       <Header />
//       <Navbar />
    
//       {/* Hero image under the header */}
//       {/* <div className="w-[90%] h-[500px] relative"> */}
//       <div className="flex justify-center mt-6 h-[400px]">
//         <Image
//           src="/images/hero.jpg"
//           alt="Hero"
//           width={1000}
//           height={400}
          
//           className="rounded-2xl shadow-lg object-cover"
//           priority
//         />
//       </div>

//       {/* Main content + Sidebar */}
//       <div className="w-full flex justify-center mt-8 px-4">
//         <div className="flex w-full max-w-6xl gap-8">
//           {/* Left main content */}
//           <section className="flex-grow p-8 bg-gray-50">
//             <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
//               Latest Newsletters
//             </h1>

//             <div className="space-y-8 max-w-4xl mx-auto">
//               {posts.length === 0 ? (
//                 <p className="text-center text-gray-500">No newsletters yet.</p>
//               ) : (
//                 posts.map((n) => (
//                   <div
//                     key={n.id}
//                     className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6"
//                   >
//                     {n.image_url && (
//                       <div className="w-full md:w-1/3">
//                         <img
//                           src={n.image_url}
//                           alt={n.title}
//                           className="w-full h-48 object-cover rounded-md"
//                         />
//                       </div>
//                     )}
//                     <div className="flex-1">
//                       <h2 className="text-2xl font-semibold mb-2">{n.title}</h2>
//                       <p className="text-gray-700 mb-4">
//                         {n.content.substring(0, 150)}...
//                       </p>
//                       <ReadMoreButton id={n.id} />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="text-center mt-10">
//               <Link href="/newsletter">
//                 <button className="text-blue-600 hover:underline">
//                   View All Newsletters →
//                 </button>
//               </Link>
//             </div>
//           </section>

//           {/* Right Sidebar */}
          
//           <Sidebar />
//         </div>
//       </div>

//     </main>
//   );
// }
"use client";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Image from "next/image";
import Sidebar from "./components/sidebar";
import ReadMoreButton from "./components/ReadMoreButton";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";  
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
}     

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3); // show latest 3 on home page

      if (error) {
        console.error("Error fetching articles:", error);
      } else {
        setPosts(data as Post[]);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Navbar />

      {/* Hero image under the header */}
      <div className="flex justify-center mt-6 h-[400px]">
        <Image
          src="/images/hero.jpg"
          alt="Hero"
          width={1000}
          height={400}
          className="rounded-2xl shadow-lg object-cover"
          priority
        />
      </div>

      {/* Main content + Sidebar */}
      <div className="w-full flex justify-center mt-8 px-4">
        <div className="flex w-full max-w-6xl gap-8">
          {/* Left main content */}
          <section className="flex-grow p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
              Latest Newsletters
            </h1>

            <div className="space-y-8 max-w-4xl mx-auto">
              {posts.length === 0 ? (
                <p className="text-center text-gray-500">No newsletters yet.</p>
              ) : (
                posts.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6"
                  >
                    {n.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={n.image_url}
                          alt={n.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2">{n.title}</h2>
                      <p className="text-gray-700 mb-4">
                        {n.content.substring(0, 150)}...
                      </p>
                      <ReadMoreButton id={n.id} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-10">
              <Link href="/newsletter">
                <button className="text-blue-600 hover:underline">
                  View All Newsletters →
                </button>
              </Link>
            </div>
          </section>

          {/* Right Sidebar */}
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
