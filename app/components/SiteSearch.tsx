"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";

interface SearchItem {
  id: number | string;
  type: "Product" | "Page" | "Blog";
  title: string;
  url: string;
  image_url?: string;
}

export default function SiteSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch items from Supabase on mount
  useEffect(() => {
    const fetchItems = async () => {
      // Fetch Products
      const { data: products, error: prodError } = await supabase()
        .from("products")
        .select("id, name, image_url, category");

      if (prodError) {
        console.error("Error fetching products:", prodError);
        return;
      }

      // Map products to SearchItem format
      const productItems: SearchItem[] = (products || []).map((p: any) => ({
        id: p.id,
        type: "Product",
        title: p.name,
        url: `/products/${p.id}`, // Adjust to your frontend route
        image_url: p.image_url || undefined,
      }));

      // TODO: Fetch pages or blog posts here similarly
      const pageItems: SearchItem[] = [
        { id: "about", type: "Page", title: "About Us", url: "/about" },
        { id: "contact", type: "Page", title: "Contact", url: "/contact" },
      ];

      const blogItems: SearchItem[] = [
        { id: 1, type: "Blog", title: "How to Choose a Mattress", url: "/blog/mattress-guide" },
        { id: 2, type: "Blog", title: "Futon Maintenance Tips", url: "/blog/futon-tips" },
      ];

      setItems([...productItems, ...pageItems, ...blogItems]);
    };

    fetchItems();
  }, []);

  // Filter items based on input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setSearchQuery(item.title);
    setShowDropdown(false);
    window.location.href = item.url;
  };

  const grouped = filteredItems.reduce((acc: Record<string, SearchItem[]>, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="relative w-62" ref={containerRef}>
      {/* Search Input */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-300">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M21 21l-4.35-4.35"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search the site..."
          className="w-full text-sm focus:outline-none"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white border rounded-b-xl shadow-xl z-50 max-h-64 overflow-auto animate-fadeIn">
          {filteredItems.length === 0 ? (
            <p className="text-gray-400 text-sm px-2 py-1">No results found</p>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="border-b last:border-b-0">
                <h4 className="text-gray-500 text-xs uppercase px-2 py-1 font-bold bg-gray-50">
                  {type}
                </h4>
                <ul>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => handleSelect(item)}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="text-sm font-medium">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
