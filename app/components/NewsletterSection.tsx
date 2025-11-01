"use client";
import { useEffect, useState } from "react";
import newslettersData from "../../newsletters.json";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function NewsletterSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load mock data (replace with backend fetch later)
    setPosts(newslettersData);
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 space-y-6 w-full max-w-3xl">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-full bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-700">{post.content}</p>
        </div>
      ))}
    </div>
  );
}