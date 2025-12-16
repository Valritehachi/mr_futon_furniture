// import { supabase } from "@/utils/supabaseClient";
// import Image from "next/image";
// import { notFound } from "next/navigation";


// /* =======================
//    Types
// ======================= */

// type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   price: string;
//   description: string | null;
//   image_url: string | null;
//   gallery: string[] | null;
// };

// /* =======================
//    Page
// ======================= */

// export default async function SpaceSaverProductPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   // ✅ UNWRAP PARAMS (THIS IS THE FIX)
//   const { slug } = await params;

//   const { data, error } = await supabase()
//     .from("products")
//     .select("id, name, slug, price, image_url, description, gallery")
//     .eq("slug", slug)
//     .eq("category", "space-saver")
//     .single();

//   if (error || !data) {
//     return notFound();
//   }

//   const product = data as Product;

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//       <p className="text-xl font-semibold mb-6">{product.price}</p>

//       {/* MAIN IMAGE */}
//       {/* <Image
//         src={product.image_url || "/images/placeholder.png"}
//         alt={product.name}
//         width={800}
//         height={500}
//         className="rounded-lg mb-8"
//       /> */}

//       {/* MAIN IMAGE */}
//       <div className="mb-4 flex justify-center">
//         <img
//           src={product.image_url || "/images/placeholder.png"}
//           alt={product.name}
//           className="max-h-[420px] object-contain rounded-lg bg-white"
//         />
//       </div>

//        {/* GALLERY */}
//       {Array.isArray(product.gallery) && product.gallery.length > 0 && (
//         <div className="mt-6 grid grid-cols-4 gap-4">
//           {product.gallery.map((img, idx) => (
//             <div
//               key={idx}
//               className="bg-white border rounded-lg overflow-hidden"
//             >
//               <div className="relative aspect-square">
//                 <Image
//                   src={img}
//                   alt={`${product.name} image ${idx + 1}`}
//                   fill
//                   className="object-contain"
//                   sizes="(max-width: 768px) 50vw, 200px"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* DESCRIPTION */}
//       {product.description && (
//         <div
//           className="prose max-w-none mb-10"
//           dangerouslySetInnerHTML={{ __html: product.description }}
//         />
//       )}

     
//     </div>
//   );
// }

import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import ProductGallery from "./ProductGallery";

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
   Page (SERVER COMPONENT)
======================= */

export default async function SpaceSaverProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ MUST AWAIT PARAMS
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: IMAGES */}
        <ProductGallery
          mainImage={product.image_url}
          gallery={product.gallery}
          name={product.name}
        />

        {/* RIGHT: INFO */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">{product.price}</p>

          {product.description && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

