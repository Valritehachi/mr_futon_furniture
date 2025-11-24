

// import Image from 'next/image';
// import { useEffect, useState } from 'react';

// const images = [
//   "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_main.jpg",
//   "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_1.jpg",
//   "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_2.jpg",
//   "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_3.jpg"
// ];

// export default function HeroSlider(){
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const t = setInterval(()=> setIndex(i=> (i+1) % images.length), 4500);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <div className="relative">
//       <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded overflow-hidden">
//         {images.map((src, i)=> (
//           <div
//             key={src}
//             className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
//             aria-hidden={i !== index}
//           >
//             <Image 
//               src={src} 
//               alt={`Futon hero slide ${i+1}`} 
//               fill 
//               style={{ objectFit: 'cover' }} 
//               priority={i === 0}
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Pagination dots */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
//         {images.map((_, i)=> (
//           <button
//             key={i}
//             onClick={()=> setIndex(i)}
//             className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}
//             aria-label={`Go to slide ${i+1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabaseClient";

export default function HeroSlider() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data, error } = await supabase
        .from("frontpage")
        .select("hero_images")
        .eq("id", 1)
        .single();

      console.log("Fetched data:", data);

      if (data && data.hero_images) {
        setImages(data.hero_images);
      }
      setLoading(false);
    };

    fetchHeroImages();
  }, []);

  

  useEffect(() => {
    if (images.length === 0) return;
    const t = setInterval(() => setIndex(i => (i + 1) % images.length), 4500);
    return () => clearInterval(t);
  }, [images.length]);

  if (loading) {
    return (
      <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-400">No hero images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded overflow-hidden">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== index}
          >
            <Image 
              src={src} 
              alt={`Futon hero slide ${i + 1}`} 
              fill 
              style={{ objectFit: 'cover' }} 
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}