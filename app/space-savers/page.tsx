
// import Image from "next/image";
// import Link from "next/link";
// import { supabase } from "@/utils/supabaseClient";



// import SofaHeroSlider from "@/app/components/HeroSliderSofaSleeper";
// import SofaHeader from "../components/SofaHeader";
// import SofaFooter from "../components/SofaFooter";

// type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   price: string;
//   image_url: string;
//   description: string;
// };

// export default async function SpaceSaversPage() {

//   const { data: products, error } = await supabase()
//     .from("products")
//     .select("id, name, slug, price, image_url, description")
//     .eq("category", "space-saver");

//   if (error) {
//     console.error("Supabase error:", error);
//   }

//   return (
//     <div className="w-full bg-white">
//       {/* HEADER */}
//       <SofaHeader />

//       {/* PAGE TITLE */}
//       <section className="max-w-6xl mx-auto px-4 pt-10">
//         <h1 className="text-4xl font-light mb-8">
//           Welcome to Small Sofa Sleepers
//         </h1>
//       </section>

//       {/* HERO + SIDE CONTENT */}
//       <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
//         {/* LEFT: HERO SLIDER */}
//         <div className="lg:col-span-2 flex">
//           <div className="w-full min-h-[420px] bg-gray-100 rounded flex items-center justify-center">
//             <SofaHeroSlider />
//           </div>
//         </div>

//         {/* RIGHT: INFO / CTA */}
//         <div className="flex flex-col gap-6">
//           <div className="bg-gray-100 p-6 text-center">
//             <p className="italic font-bold text-lg">
//               Small Sofa Convertibles For Small Rooms
//             </p>
//             <p className="italic font-bold mt-2">
//               Hand Crafted Solid Oak American Made Furniture.
//             </p>
//           </div>

//           <div className="bg-gray-100 p-6 text-center">
//             <p className="text-xl font-bold tracking-wide">
//               CALL&nbsp; (561) 572-3267
//             </p>
//           </div>

//           <div className="overflow-hidden rounded">
//             <img
//               src="/images/sofa_sleeper_promo.png"
//               alt="Save up to 25 percent off"
//               className="w-full object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* BLUE FEATURE BANNER */}
//       <section className="max-w-6xl mx-auto mt-14 px-4">
//         <div className="bg-sky-300 py-8 px-6 text-center text-xl font-semibold rounded">
//           Chair Sofa Sleepers Transform Effortlessly From a Cozy Cot, Twin or
//           Full Size Sofa to a Very Comfortable Bed.
//         </div>
//       </section>

//       {/* PRODUCT GRID */}
//       <section className="max-w-5xl mx-auto py-12 px-4">
//         <h2 className="text-3xl font-bold mb-4">
//           Small Sofa Sleepers & Space Savers
//         </h2>

//         <p className="text-gray-700 text-lg mb-12">
//           Discover our compact, solid-wood sofa sleepers designed for small
//           rooms, apartments, and tiny homes.
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//           {products?.map((product: Product) => (

//             <div key={product.id} className="text-center">
//               <Link href={`/space-savers/${product.slug}`}>
//                 <Image
//                   src={product.image_url}
//                   alt={product.name}
//                   width={400}
//                   height={300}
//                   className="mx-auto hover:opacity-90 transition cursor-pointer"
//                 />
//               </Link>

//               <Link href={`/space-savers/${product.slug}`}>
//                 <h3 className="mt-4 text-base font-bold underline cursor-pointer">
//                   {product.name}
//                 </h3>
//               </Link>

//               <p className="mt-3 text-lg font-bold text-gray-900">
//                 {product.price}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* VIDEO SECTION */}
//       <section className="max-w-7xl mx-auto mt-20 px-4 flex justify-center">
//         <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-lg">
//           <video
//             className="w-full h-full object-cover"
//             src="/TwinSofaSleepervideo_opt.mp4"
//             controls
//             muted
//             loop
//             playsInline
//           />
//         </div>
//       </section>

//       <SofaFooter />
//     </div>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import SofaHeroSlider from "@/app/components/HeroSliderSofaSleeper";
import SofaHeader from "../components/SofaHeader";
import SofaFooter from "../components/SofaFooter";
import { supabase } from "@/utils/supabaseClient";

/* =======================
   Types
======================= */

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image_url: string | null;
  description: string | null;
};

/* =======================
   Page (SERVER COMPONENT)
======================= */

export default async function SpaceSaversPage() {

  const { data: products, error } = await supabase()
    .from("products")
    .select("id, name, slug, price, image_url, description")
    .eq("category", "space-saver")
    .not("slug", "is", null)
    .order("created_at", { ascending: false });

    const typedProducts = (products ?? []) as Product[];  
  if (error) {
    console.error("Supabase error:", error);
  }

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <SofaHeader />

      {/* PAGE TITLE */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <h1 className="text-4xl font-light mb-8">
          Welcome to Small Sofa Sleepers
        </h1>
      </section>

      {/* HERO + SIDE CONTENT */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* LEFT: HERO SLIDER */}
        <div className="lg:col-span-2 flex">
          <div className="w-full min-h-[420px] bg-gray-100 rounded flex items-center justify-center">
            <SofaHeroSlider />
          </div>
        </div>

        {/* RIGHT: INFO / CTA */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-100 p-6 text-center">
            <p className="italic font-bold text-lg">
              Small Sofa Convertibles For Small Rooms
            </p>
            <p className="italic font-bold mt-2">
              Hand Crafted Solid Oak American Made Furniture.
            </p>
          </div>

          <div className="bg-gray-100 p-6 text-center">
            <p className="text-xl font-bold tracking-wide">
              CALL&nbsp; (561) 572-3267
            </p>
          </div>

          <div className="overflow-hidden rounded">
            <img
              src="/images/sofa_sleeper_promo.png"
              alt="Save up to 25 percent off"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURE BANNER */}
      <section className="max-w-6xl mx-auto mt-14 px-4">
        <div className="bg-sky-300 py-8 px-6 text-center text-xl font-semibold rounded">
          Chair Sofa Sleepers Transform Effortlessly From a Cozy Cot, Twin or
          Full Size Sofa to a Very Comfortable Bed.
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-4">
          Small Sofa Sleepers & Space Savers
        </h2>

        <p className="text-gray-700 text-lg mb-12">
          Discover our compact, solid-wood sofa sleepers designed for small
          rooms, apartments, and tiny homes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {products && products.length > 0 ? (
            products.map((product: Product) => (

              <div key={product.id} className="text-center">
                <Link href={`/space-savers/${product.slug}`}>
                  <Image
                    src={product.image_url || "/images/placeholder.png"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="mx-auto hover:opacity-90 transition cursor-pointer rounded"
                  />
                </Link>

                <Link href={`/space-savers/${product.slug}`}>
                  <h3 className="mt-4 text-base font-bold underline cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                <p className="mt-3 text-lg font-bold text-gray-900">
                  {product.price}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No space saver products available yet.
            </p>
          )}
        </div>

      </section>

      {/* VIDEO SECTION */}
      <section className="max-w-7xl mx-auto mt-20 px-4 flex justify-center">
        <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-lg">
          <video
            className="w-full h-full object-cover"
            src="/TwinSofaSleepervideo_opt.mp4"
            controls
            muted
            loop
            playsInline
          />
        </div>
      </section>

      <SofaFooter />
    </div>
  );
}
