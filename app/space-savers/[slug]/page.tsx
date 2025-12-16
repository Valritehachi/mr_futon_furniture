import { supabase } from "@/utils/supabaseClient";
import Image from "next/image";
import { notFound } from "next/navigation";

/* =======================
   Types
======================= */

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
};

/* =======================
   Page
======================= */

export default async function SpaceSaverProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ UNWRAP PARAMS (THIS IS THE FIX)
  const { slug } = await params;

  const { data, error } = await supabase()
    .from("products")
    .select("id, name, slug, price, image_url, description, gallery")
    .eq("slug", slug)
    .eq("category", "space-saver")
    .single();

  if (error || !data) {
    return notFound();
  }

  const product = data as Product;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-xl font-semibold mb-6">{product.price}</p>

      {/* MAIN IMAGE */}
      <Image
        src={product.image_url || "/images/placeholder.png"}
        alt={product.name}
        width={800}
        height={500}
        className="rounded-lg mb-8"
      />

      {/* DESCRIPTION */}
      {product.description && (
        <div
          className="prose max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      {/* GALLERY */}
      {Array.isArray(product.gallery) && product.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.gallery.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              className="rounded-lg border"
              alt={`${product.name} image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

