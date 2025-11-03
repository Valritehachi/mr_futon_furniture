"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ArticleEditor = dynamic(() => import("../../../components/ArticleEditor"), { ssr: false });

export default function AdminDashboard(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };
    check();

    // optional: subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.push("/admin/login");
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div>
            <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">
              Logout
            </button>
          </div>
        </div>

        <ArticleEditor />
      </div>
    </div>
  );
}
