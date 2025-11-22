"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_main.jpg",
  "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_1.jpg",
  "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_2.jpg",
  "https://obkhemmqcmujtwykliwf.supabase.co/storage/v1/object/public/images/futon_hero_3.jpg"
];
export default function HeroSlider(){
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(()=> setIndex(i=> (i+1) % images.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      <div className="h-[420px] md:h-[520px] w-full bg-gray-100 rounded overflow-hidden">
        {images.map((src, i)=> (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== index}
          >
            <Image src={src} alt={`slide-${i}`} fill style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* small pagination dots */}
      <div className="absolute bottom-4 flex justify-center align-middle mt-3 gap-2">
        {images.map((_, i)=> (
          <button
            key={i}
            onClick={()=> setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-blue-600' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${i+1}`}
          />
        ))}
      </div>
    </div>
  );
}
