"use client";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Image from "next/image";
import Sidebar from "./components/sidebar";
import ReadMoreButton from "./components/ReadMoreButton";
import LoadMoreButton from "./components/LoadMoreButton";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  published_at?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit, setLimit] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);

  const fetchArticles = async (currentLimit: number) => {
    const { data, error, count } = await supabase
      .from("articles")
      .select("*", { count: "exact" })
      .order("published_at", { ascending: false })
      .limit(currentLimit);

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }

    setPosts(data as Post[]);

    if (count && currentLimit >= count) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchArticles(limit);
  }, [limit]);

  const loadMoreButtonHandler = () => {
    setLimit((prev) => prev + 8);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Navbar />

      {/* Hero image - responsive */}
      <div className="flex justify-center mt-4 lg:mt-6 px-4 lg:px-0">
        <div className="w-full max-w-6xl h-[200px] sm:h-[300px] lg:h-[400px]">
          <Image
            src="/images/hero.jpg"
            alt="Hero"
            width={1000}
            height={400}
            className="w-full h-full rounded-2xl shadow-lg object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex justify-center mt-4 lg:mt-8 px-4 lg:px-0">
        {/* Stack vertically on mobile, side-by-side on desktop */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-8">
                
          {/* Left main content (full width mobile, ¾ width desktop) */}
          <section className="w-full lg:w-3/4 p-4 lg:p-6 bg-gray-50 rounded-lg">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-center text-blue-600">
              Latest Newsletters
            </h1>

            <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto">
              {/* Your content */}
              {posts.length === 0 ? (
                <p className="text-center text-gray-500">No newsletters yet.</p>
              ) : (
                posts.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white border border-gray-200 rounded-lg shadow p-4 lg:p-6 flex flex-col md:flex-row gap-4 lg:gap-6"
                  >
                    {n.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={n.image_url}
                          alt={n.title}
                          className="w-full h-48 md:h-80 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl lg:text-2xl font-semibold mb-2">{n.title}</h2>
                      {n.published_at && (
                        <p className="text-gray-500 text-sm mb-2">
                          🗓️ {new Date(n.published_at).toLocaleDateString()}
                        </p>
                      )}
                      <div
                        className="text-gray-700 mb-4 text-sm lg:text-base prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: n.content.substring(0, 300) + "..." }}
                      ></div>
                      <ReadMoreButton id={n.id} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Button */}
            <LoadMoreButton
              onClick={loadMoreButtonHandler}
              hasMore={hasMore}
            />
          </section>

          {/* Right Sidebar (full width mobile, ¼ width desktop) */}
          <aside className="w-full lg:w-1/4 bg-gray-100 rounded-2xl p-4 lg:p-6">
            <Sidebar refreshCommentsTrigger={commentsRefreshTrigger} />
          </aside>
        </div>
      </div>
    </main>
  );
}