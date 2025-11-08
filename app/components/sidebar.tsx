"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import Searchbar from "./SearchBar";
import error from "next/error";

interface Article {
  id: number;
  title: string;
  created_at: string;
}

interface Comment {
  id: number;
  author_name: string;
  comment: string;
  created_at: string;
  article_id: number;
  articles: { title: string }[];
}

interface Archive {
  month: string;
  year: number;
  count: number;
}


interface SidebarProps {
  refreshCommentsTrigger?: number;
}



const Sidebar: React.FC<SidebarProps> = ({ refreshCommentsTrigger }) => {
  const [recentPosts, setRecentPosts] = useState<Article[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Utility function to truncate long comments
  const truncateComment = (text: string, length = 50) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch recent posts
      const { data: posts, error: postsError } = await supabase
        .from("articles")
        .select("id, title, created_at")
        .order("published_at", { ascending: false })
        .limit(5);
      if (!postsError && posts) setRecentPosts(posts);


      

      // Fetch recent comments with article titles
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
            id,
            author_name,
            comment,
            created_at,
            article_id,
            articles(title)
          `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (!commentsError && comments) setRecentComments(comments);
      setCommentsLoading(false);

     

      // Fetch all articles to generate archives
      const { data: allPosts, error: archivesError } = await supabase
        .from("articles")
        .select("published_at")
        .order("published_at", { ascending: false })
        .limit(100);
      if (!archivesError && allPosts) {
        const archiveMap = new Map<string, number>();
        allPosts.forEach((post) => {
          const date = new Date(post.published_at);
          const monthYear = `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getFullYear()}`;
          archiveMap.set(monthYear, (archiveMap.get(monthYear) || 0) + 1);
        });

        const archiveArray = Array.from(archiveMap.entries())
          .map(([monthYear, count]) => {
            const [month, year] = monthYear.split(" ");
            return { month, year: parseInt(year), count };
          })
          .slice(0, 24);

        setArchives(archiveArray);
      }

      setLoading(false);
    };
    
    fetchData();
  }, [refreshCommentsTrigger]);

  return (
    <aside className="w-1/4 h-full self-start bg-gray-100 rounded-2xl p-6 shadow-md h-[calc(100vh-200px)] overflow-y-auto">
      <Searchbar />

      {/* Recent Posts */}
      <h3 className="italic text-base font-semibold mb-4">Recent Posts</h3>
      <ul className="arrow-bullet mb-6 space-y-2 text-gray-700 list-none">
        {loading ? (
          <li className="text-gray-500 italic text-xs">Loading...</li>
        ) : recentPosts.length === 0 ? (
          <li className="text-gray-500 italic text-xs">No posts yet</li>
        ) : (
          recentPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/newsletter/${post.id}`}
                className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
              >
                {post.title}
              </Link>
            </li>
          ))
        )}
      </ul>

      <h3 className="italic text-base font-semibold mb-4">Recent Comments</h3>
      
      <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
        {commentsLoading ? (
          <li className="text-gray-500 italic text-xs">Loading...</li>
        ) : recentComments.length === 0 ? (
          <li className="text-gray-500 italic text-xs">No comments yet</li>
        ) : (
          
          recentComments.map((comment) => (
            <li key={comment.id}>
              <Link
                href={`/newsletter/${comment.article_id}`}
                className="block"
              >
                <span className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all">
                  {comment.author_name}
                </span>{" "}
                <span className="text-gray-600 italic text-xs">on</span>{" "}
                <span className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all">
                  {comment.articles?.[0]?.title || "Unknown Article"}
                </span>
                <p className="text-gray-500 italic text-xs mt-1">
                  "{truncateComment(comment.comment)}"
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>

      {/* Archives */}
      <h3 className="italic text-base font-semibold mb-4">Archives</h3>
      <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
        {loading ? (
          <li className="text-gray-500 italic text-xs">Loading...</li>
        ) : archives.length === 0 ? (
          <li className="text-gray-500 italic text-xs">No archives yet</li>
        ) : (
          archives.map((archive, index) => (
            <li key={index}>
              <Link
                href={`/archives/${archive.month.toLowerCase()}-${archive.year}`}
                className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
              >
                {archive.month} {archive.year} ({archive.count})
              </Link>
            </li>
          ))
        )}
      </ul>

      {/* Categories */}
      <h3 className="italic text-base font-semibold mb-4">Categories</h3>
      <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
        <li>
          <Link
            href="/categories/achievers-trailblazers"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Achievers & Trailblazers
          </Link>
        </li>
        <li>
          <Link
            href="/categories/beneficiaries"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Beneficiaries of James "Dick" Richards Trust
          </Link>
        </li>
        <li>
          <Link
            href="/categories/philanthropy"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Bosa Philanthropy
          </Link>
        </li>
        <li>
          <Link
            href="/categories/history"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            History
          </Link>
        </li>
        <li>
          <Link
            href="/newsletter"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Newsletter
          </Link>
        </li>
        <li>
          <Link
            href="/categories/support"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Support Opportunities
          </Link>
        </li>
        <li>
          <Link
            href="/categories/proverbs"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            The Jamaican Proverbs
          </Link>
        </li>
        <li>
          <Link
            href="/categories/uncategorized"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Uncategorized
          </Link>
        </li>
      </ul>

      {/* Meta */}
      <h3 className="italic text-base font-semibold mb-4">Meta</h3>
      <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
        <li>
          <Link
            href="/admin/login"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Log in
          </Link>
        </li>
        <li>
          <Link
            href="/feeds/entries"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Entries feed
          </Link>
        </li>
        <li>
          <Link
            href="/feeds/comments"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            Comments feed
          </Link>
        </li>
        <li>
          <Link
            href="https://wordpress.org"
            target="_blank"
            className="text-blue-600 italic text-xs hover:font-bold hover:underline transition-all"
          >
            WordPress.org
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
