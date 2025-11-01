"use client";
import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-1/4 bg-gray-100 rounded-2xl p-6 shadow-md h-[calc(100vh-200px)] overflow-y-auto">
    {/* Recent Posts */}
    <h3 className="italic text-base font-semibold mb-4">Recent Posts</h3>
        <ul className="arrow-bullet mb-6 space-y-2 text-gray-700 list-none">
            <li>
            <Link
                href="/posts/ui-design"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
            >
                bosa post 1
            </Link>
            </li>
        </ul>

    {/* Recent Comments */}
    <h3 className="italic text-base font-semibold mb-4">Recent Comments</h3>
        <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
            <li>
            <Link
                href="/comments/ui-design"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
            >
                bosa post 1
            </Link>
            </li>
        </ul>

    {/* Archives */}
    <h3 className="italic text-base font-semibold mb-4">Archives</h3>
        <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
            <li>
            <Link
                href="/archives/october-2025"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
            >
                October 2025
            </Link>
            </li>
            <li>
            <Link
                href="/archives/september-2025"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
            >
                September 2025
            </Link>
            </li>
            <li>
            <Link
                href="/archives/august-2025"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
            >
                August 2025
            </Link>
            </li>
        </ul>

      <h3 className="italic text-base font-semibold mb-4">Categories</h3>
        <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
            <li>
                <Link
                href="/categories/design"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Achievers & Trailblazers
                </Link>
            </li>
            <li>
                <Link
                href="/categories/development"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Beneficiaries of James "Dick" Richards Trust
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Bosa Philanthropy
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                History
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Newsletter
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Support Opportunities
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                The Jamaican Proverbs
                </Link>
            </li>
            <li>
                <Link
                href="/categories/inspiration"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Uncategorized
                </Link>
            </li>
        </ul>

        <h3 className="italic text-base font-semibold mb-4">Meta</h3>
        <ul className="arrow-bullet mb-6 space-y-2 text-gray-700">
            <li>
                <Link
                href="/login"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Log in
                </Link>
            </li>
            <li>
                <Link
                href="/feeds/entries"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Entries feed
                </Link>
            </li>
            <li>
                <Link
                href="/feeds/comments"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                Comments feed
                </Link>
            </li>
            <li>
                <Link
                href="https://wordpress.org"
                target="_blank"
                className="text-blue-600 italic text-xs hover:font-bold hover:underline focus:font-bold focus:underline transition-all"
                >
                WordPress.org
                </Link>
            </li>
        </ul>
    </aside>
  );
};

export default Sidebar;