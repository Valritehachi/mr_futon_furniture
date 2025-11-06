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
  const [limit, setLimit] = useState(8); // initial number of posts
  const [hasMore, setHasMore] = useState(true);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);

  // Fetch posts from Supabase
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
      setHasMore(false); // hide Load More if all posts are loaded
    }
  };

  useEffect(() => {
    fetchArticles(limit);
  }, [limit]);

  // Load More button handler
  const loadMoreButtonHandler = () => {
    setLimit((prev) => prev + 8);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Navbar />

      {/* Hero image */}
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
                          width={600}
                          height={600}
                          className="w-full h-80 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-1">{n.title}</h2>
                      {n.published_at && (
                        <p className="text-gray-500 text-sm mb-2">
                          🗓️ {new Date(n.published_at).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4">
                        {n.content.substring(0, 150)}...
                      </p>
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

          {/* Right Sidebar */}
          {/* <Sidebar /> */}
          <Sidebar refreshCommentsTrigger={commentsRefreshTrigger} />

        </div>
      </div>
    </main>
  );
}
