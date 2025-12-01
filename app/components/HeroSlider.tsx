// "use client";

// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { supabase } from "@/utils/supabaseClient";

// export default function HeroSlider() {
//   const [images, setImages] = useState<string[]>([]);
//   const [index, setIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHeroImages = async () => {
//       const { data, error } = await supabase
//         .from("frontpage")
//         .select("hero_images")
//         .eq("id", 1)
//         .single();

//       console.log("Fetched data:", data);

//       if (data && data.hero_images) {
//         setImages(data.hero_images);
//       }
//       setLoading(false);
//     };

//     fetchHeroImages();
//   }, []);

  

//   useEffect(() => {
//     if (images.length === 0) return;
//     const t = setInterval(() => setIndex(i => (i + 1) % images.length), 4500);
//     return () => clearInterval(t);
//   }, [images.length]);

//   if (loading) {
//     return (
//       <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded flex items-center justify-center">
//         <div className="animate-pulse text-gray-400">Loading...</div>
//       </div>
//     );
//   }

//   if (images.length === 0) {
//     return (
//       <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded flex items-center justify-center">
//         <p className="text-gray-400">No hero images available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] w-full bg-gray-100 rounded overflow-hidden">
//         {images.map((src, i) => (
//           <div
//             key={src}
//             className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
//             aria-hidden={i !== index}
//           >
//             <Image 
//               src={src} 
//               alt={`Futon hero slide ${i + 1}`} 
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
//         {images.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setIndex(i)}
//             className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${i === index ? 'bg-blue-600' : 'bg-gray-300'}`}
//             aria-label={`Go to slide ${i + 1}`}
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

interface HeroImage {
  url: string;
  text: string;
}

export default function HeroSlider() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data, error } = await supabase
        .from("frontpage")
        .select("hero_images")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching hero images:", error);
        setLoading(false);
        return;
      }

      console.log("Raw data from Supabase:", data);

      if (data && data.hero_images) {
        let parsedImages: HeroImage[] = [];

        // Handle different data formats
        if (Array.isArray(data.hero_images)) {
          parsedImages = data.hero_images
            .map((img: any) => {
              // If it's already an object with url
              if (typeof img === 'object' && img !== null && img.url) {
                return {
                  url: img.url || '',
                  text: img.text || ''
                };
              }
              // If it's a string, try to parse it
              if (typeof img === 'string') {
                // Check if it's a JSON string
                if (img.startsWith('{')) {
                  try {
                    const parsed = JSON.parse(img);
                    return {
                      url: parsed.url || '',
                      text: parsed.text || ''
                    };
                  } catch (e) {
                    console.error("Failed to parse image string:", img, e);
                    return null;
                  }
                }
                // If it's just a URL string
                return { url: img, text: '' };
              }
              return null;
            })
            .filter((img): img is HeroImage => 
              img !== null && 
              typeof img.url === 'string' && 
              img.url.length > 0 &&
              img.url.startsWith('http')
            );
        }

        console.log("Parsed images:", parsedImages);
        setImages(parsedImages);
      }

      setLoading(false);
    };

    fetchHeroImages();
  }, []);

  // Slider interval
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
        {images.map((image, i) => (
          <div
            key={`${image.url}-${i}`}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== index}
          >
            <Image
              src={image.url}
              alt={image.text || `Hero slide ${i + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            {/* Text overlay */}
            {image.text && (
              <div className="absolute bottom-12 sm:bottom-14 left-0 right-0 flex justify-center px-4">
              <div className="bg-[rgba(255,255,255,0.1)] px-6 py-3 rounded-lg shadow-lg max-w-2xl text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold">
                  {image.text}
                </p>
              </div>
            </div>
            )}


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