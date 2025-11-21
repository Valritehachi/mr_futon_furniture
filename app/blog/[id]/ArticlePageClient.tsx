"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
}

export default function ArticlePageClient({ id }: { id: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [previousArticle, setPreviousArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      // Fetch current article
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) setArticle(data as Article);
    };

    const fetchAdjacentArticles = async () => {
      // Fetch previous article (older article with id < current)
      const { data: prevData } = await supabase
        .from("blog")
        .select("*")
        .lt("id", id)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (prevData) setPreviousArticle(prevData as Article);

      // Fetch next article (newer article with id > current)
      const { data: nextData } = await supabase
        .from("blog")
        .select("*")
        .gt("id", id)
        .order("id", { ascending: true })
        .limit(1)
        .single();

      if (nextData) setNextArticle(nextData as Article);
    };

    fetchArticle();
    fetchAdjacentArticles();
  }, [id]);

  if (!article)
    return (
      <p className="text-center py-20 text-gray-500 text-xl">Loading...</p>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Article Content */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {article.title}
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        📅 {new Date(article.created_at).toLocaleDateString()}
      </p>

      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-auto rounded-xl mb-8 shadow"
        />
      )}

      <article
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Previous and Next Article Navigation */}
      <div className="border-t pt-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Previous Article */}
          <div>
            {previousArticle ? (
              <Link
                href={`/blog/${previousArticle.id}`}
                className="block group hover:bg-gray-50 p-4 rounded-lg transition"
              >
                <p className="text-sm font-bold text-gray-500 mb-2">
                    👈👈  Previous Article
                </p>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {previousArticle.title}
                </h3>
              </Link>
            ) : (
              <div className="p-4 text-gray-400">
                <p className="text-sm mb-2">← Previous Article</p>
                <p className="text-sm">No previous article</p>
              </div>
            )}
          </div>

          {/* Next Article */}
          <div className="text-left md:text-right">
            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.id}`}
                className="block group hover:bg-gray-50 p-4 rounded-lg transition"
              >
                <p className="text-sm font-bold text-gray-500 mb-2">
                  Next Article  👉👉
                </p>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {nextArticle.title}
                </h3>
              </Link>
            ) : (
              <div className="p-4 text-gray-400">
                <p className="text-l mb-2">Next Article →</p>
                <p className="text-sm">No next article</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Blog Link */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-block text-black-600 hover:text-blue-800 font-semibold"
        >
          ⬅ Back to Blog
        </Link>
      </div>
    </div>
  );
}