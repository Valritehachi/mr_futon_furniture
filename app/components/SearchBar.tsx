"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

interface Article {
  id: number;
  title: string;
  created_at: string;
}

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search function
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const { data, error } = await supabase
      .from("articles")
      .select("id, title, created_at")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setSearchResults(data);
    }
    
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="mb-6">
      <h3 className="italic text-base font-semibold mb-3">Search Newsletter</h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm italic"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        {!searchQuery && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && (
        <div className="mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 text-sm italic">
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm italic">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <ul className="py-2">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/newsletter/${result.id}`}
                    onClick={clearSearch}
                    className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-blue-600 italic text-sm font-semibold hover:underline">
                      {result.title}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {new Date(result.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t-2 border-gray-300 mt-6"></div>
    </div>
  );
};

export default SearchBar;