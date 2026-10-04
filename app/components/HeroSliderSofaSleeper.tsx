"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface HeroImage {
  url: string;
  text?: string;
}

const DEFAULT_IMAGES: HeroImage[] = [
  { url: "/images/futon_hero_1.jpg" },
  { url: "/images/futon_hero_2.jpg" },
  { url: "/images/futon_hero_3.jpg" },
];

export default function SofaHeroSlider() {
  const [images, setImages] = useState<HeroImage[]>(DEFAULT_IMAGES);
  const [index, setIndex] = useState(0);

  /** --------------------------------------------------------
   * FETCH sofa_hero_images FROM SUPABASE
   * -------------------------------------------------------- */
  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase ()
        .from("frontpage")
        .select("sofa_hero_images")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("❌ Error fetching sofa hero images:", error);
        return;
      }

      const raw = data?.sofa_hero_images ?? [];

      // ALWAYS PARSE INTO A TEMPORARY ARRAY (NO STATE ASSIGNMENT YET)
      const temp: HeroImage[] = [];

      for (const item of raw) {
        try {
          // Case 1: Already an object
          if (typeof item === "object" && item?.url) {
            temp.push({
              url: item.url,
              text: item.text ?? "",
            });
            continue;
          }

          // Case 2: JSON string
          if (typeof item === "string" && item.startsWith("{")) {
            const parsed = JSON.parse(item);
            if (parsed.url) {
              temp.push({
                url: parsed.url,
                text: parsed.text ?? "",
              });
            }
            continue;
          }

          // Case 3: Plain URL string
          if (typeof item === "string" && item.startsWith("http")) {
            temp.push({ url: item, text: "" });
            continue;
          }
        } catch (err) {
          console.error("Parsing error:", err);
        }
      }

      // Override defaults only when Supabase has images configured
      if (temp.length > 0) setImages(temp);
    }

    fetchImages();
  }, []);

  /** AUTO-SLIDE */
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      4500
    );
    return () => clearInterval(timer);
  }, [images.length]);

  /** --------------------------------------------------------
   * RENDER SLIDER
   * -------------------------------------------------------- */
  return (
    <div className="relative w-full">
      <div className="relative h-[300px] sm:h-[350px] md:h-[450px] lg:h-[520px] overflow-hidden rounded">
        {images.map((image, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.url}
              alt={image.text || `Slide ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />

            {image.text && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <div className="bg-black/40 px-5 py-3 rounded-lg text-center max-w-xl">
                  <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white drop-shadow">
                    {image.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
