// BackLink.tsx
"use client";

import Link from "next/link";

interface BackLinkProps {
  category: string;
}

export default function BackLink({ category }: BackLinkProps) {
  // Convert category to URL-friendly format (replace spaces with hyphens)
  const href = `/${category.toLowerCase().replace(/\s+/g, '-')}`;
  const niceName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <Link
      href={href}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-8"
    >
      ← Back to {niceName}
    </Link>
  );
}
