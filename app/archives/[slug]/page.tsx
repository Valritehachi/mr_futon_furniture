"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/sidebar";
import ReadMoreButton from "@/app/components/ReadMoreButton";
import { supabase } from "@/utils/supabaseClient";

interface Post {
  id: number;
  title: string;
  content: string;
  published_at?: string;
  category?: string;
  image_url?: string;
}

export default function ArchivePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [archiveTitle, setArchiveTitle] = useState("");

  useEffect(() => {
    const fetchArchiveArticles = async () => {
      if (!slug) return;

      // Parse the slug (e.g., "january-2021")
      const parts = slug.split("-");
      const month = parts.slice(0, -1).join(" "); // Handle multi-word months
      const year = parts[parts.length - 1];

      // Create readable title
      const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
      setArchiveTitle(`${monthCapitalized} ${year}`);

      // Get month number from month name
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;

      // Fetch articles from that month and year
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .gte("published_at", `${year}-${monthNumber.toString().padStart(2, "0")}-01`)
        .lt(
          "published_at",
          monthNumber === 12
            ? `${parseInt(year) + 1}-01-01`
            : `${year}-${(monthNumber + 1).toString().padStart(2, "0")}-01`
        )
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching archive articles:", error);
      } else {
        setPosts(data as Post[]);
      }

      setLoading(false);
    };

    fetchArchiveArticles();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <div className="flex flex-1 gap-8 p-8 bg-gray-50">
        {/* Main Content */}
        <section className="flex-grow max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">
            Archives: {archiveTitle}
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">
              No articles found for {archiveTitle}.
            </p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>

                  {post.image_url && (
                    <div className="w-full mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>
                  )}

                  {post.published_at && (
                    <p className="text-gray-500 text-sm mb-3">
                      🗓️ {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  {post.category && (
                    <p className="text-blue-600 text-sm mb-3 font-medium">
                      📁 {post.category}
                    </p>
                  )}

                  <p className="text-gray-700 mb-4">
                    {post.content.substring(0, 200)}...
                  </p>

                  <ReadMoreButton id={post.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}