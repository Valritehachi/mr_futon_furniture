"use client";

import { use, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/utils/supabaseClient";
import CommentForm from "@/app/components/CommentForm";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  image_url?: string;
  published_at?: string;
  category?: string;
}

interface Comment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}


export default function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);

  // Fetch article and comments
  useEffect(() => {
    const fetchArticleAndComments = async () => {
      setLoading(true);

      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (articleError) {
        console.error("Error fetching article:", articleError);
        setError("Newsletter not found");
      } else {
        setPost(articleData as Post);
      }

      // Fetch comments
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", id)
        .order("created_at", { ascending: false });

      if (commentError) {
        console.error("Error fetching comments:", commentError);
      } else {
        setComments(commentData as Comment[]);
      }

      setLoading(false);
    };

    fetchArticleAndComments();
  }, [id, refreshTrigger]);

  const handleCommentSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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

            {post.published_at && (
              <p className="text-gray-500 text-sm mb-6">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            )}
            {/* 
            <div
              className="prose max-w-none text-gray-800 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div> */}


            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Comment Form */}
              <CommentForm
                articleId={Number(id)}
                onCommentSubmitted={() => setCommentsRefreshTrigger(prev => prev + 1)}
              />
          </article>
        ) : (
          <p className="text-center text-gray-500">Newsletter not found</p>
        )}
      </section>
    </div>
  );
}

