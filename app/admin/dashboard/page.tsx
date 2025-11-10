"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import ArticlesEditor from "@/app/components/ArticleEditor";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [articleCount, setArticleCount] = useState<number>(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        const name = user.email?.split("@")[0] || "Admin";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };

    const getArticleCount = async () => {
      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });
      setArticleCount(count || 0);
    };

    getUser();
    getArticleCount();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Beautiful Header with Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Left Side - Welcome Message */}
          <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <span className="text-4xl">👋</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-blue-100 text-lg flex items-center gap-2">
                    <span className="text-xl">📧</span>
                    {userEmail}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block mt-4">
                <p className="text-sm text-blue-100 mb-1">Ready to create amazing content?</p>
                <p className="text-2xl font-bold">Let's get started! 🚀</p>
              </div>
            </div>

            {/* Right Side - Stats Cards */}
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 min-w-[160px] shadow-xl">
                <div className="text-center">
                  <div className="text-3xl mb-2">📰</div>
                  <div className="text-4xl font-bold mb-1">{articleCount}</div>
                  <div className="text-sm text-blue-100 font-medium">Total Articles</div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 min-w-[160px] shadow-xl">
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="text-xl font-bold mb-1">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-blue-100 font-medium">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ArticlesEditor />
    </div>
  );
}



