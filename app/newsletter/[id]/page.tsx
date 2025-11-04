"use client";

import { use, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  image_url?: string;
}

export default function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setError("Newsletter not found");
      } else {
        setPost(data as Post);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <section className="flex-grow p-8 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : post ? (
          <article className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            {post.image_url && (
              <div className="mb-6">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              {post.title}
            </h1>
            {post.created_at && (
              <p className="text-gray-500 text-sm mb-6">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            )}
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </article>
        ) : (
          <p className="text-center text-gray-500">Newsletter not found</p>
        )}
      </section>
    </div>
  );
}
