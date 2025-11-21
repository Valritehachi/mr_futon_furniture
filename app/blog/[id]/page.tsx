// app/blog/[id]/page.tsx (SERVER COMPONENT - no hooks)

import ArticlePageClient from "./ArticlePageClient";

export default async function BlogArticlePage({ params }: any) {
  const { id } = await params; // Allowed in Server Component
  return <ArticlePageClient id={id} />;
}
